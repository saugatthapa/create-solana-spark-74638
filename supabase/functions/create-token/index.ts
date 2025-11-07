import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from "npm:@solana/web3.js@1.98.4";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, setAuthority, AuthorityType } from "npm:@solana/spl-token@0.4.14";
import bs58 from "https://esm.sh/bs58@5.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PLATFORM_WALLET_PRIVATE_KEY = Deno.env.get('PLATFORM_WALLET_PRIVATE_KEY');
const SOLANA_RPC_URL = 'https://api.devnet.solana.com';

interface CreateTokenRequest {
  userWallet: string;
  paymentSignature: string;
  tokenData: {
    name: string;
    symbol: string;
    decimals: number;
    supply: string;
    description: string;
    imageBase64: string;
    revokeFreeze: boolean;
    revokeMint: boolean;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!PLATFORM_WALLET_PRIVATE_KEY) {
      throw new Error('Platform wallet not configured');
    }

    const { userWallet, paymentSignature, tokenData }: CreateTokenRequest = await req.json();

    console.log('🚀 Starting token creation for user:', userWallet);

    // Initialize Solana connection
    const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
    
    // Load platform wallet from private key (supports JSON array, base58, or base64)
    let secretKeyArray: Uint8Array;
    
    try {
      // Try parsing as JSON array first (Phantom/Solflare export format)
      const parsed = JSON.parse(PLATFORM_WALLET_PRIVATE_KEY);
      if (Array.isArray(parsed)) {
        secretKeyArray = Uint8Array.from(parsed);
      } else {
        throw new Error('Invalid JSON format');
      }
    } catch {
      // Try base58 decoding (Solana CLI format)
      try {
        secretKeyArray = bs58.decode(PLATFORM_WALLET_PRIVATE_KEY);
      } catch {
        // Try base64 decoding as fallback
        try {
          secretKeyArray = Uint8Array.from(atob(PLATFORM_WALLET_PRIVATE_KEY), c => c.charCodeAt(0));
        } catch {
          throw new Error('Private key must be in JSON array, base58, or base64 format');
        }
      }
    }
    
    if (secretKeyArray.length !== 64) {
      throw new Error(`Invalid secret key size: ${secretKeyArray.length} bytes. Expected 64 bytes.`);
    }
    
    const platformKeypair = Keypair.fromSecretKey(secretKeyArray);
    const userPublicKey = new PublicKey(userWallet);

    console.log('✅ Platform wallet:', platformKeypair.publicKey.toBase58());

    // Verify payment transaction
    console.log('🔍 Verifying payment signature:', paymentSignature);
    const paymentTx = await connection.getTransaction(paymentSignature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!paymentTx) {
      throw new Error('Payment transaction not found');
    }

    // Verify payment was to platform wallet
    const platformWalletReceived = paymentTx.meta?.postBalances && paymentTx.meta?.preBalances
      ? (paymentTx.meta.postBalances[1] || 0) - (paymentTx.meta.preBalances[1] || 0)
      : 0;

    if (platformWalletReceived < 0.15 * 1_000_000_000) {
      throw new Error('Invalid payment amount');
    }

    console.log('✅ Payment verified:', platformWalletReceived / 1_000_000_000, 'SOL');

    // Step 1: Upload image to GitHub FIRST
    console.log('📸 Uploading image to GitHub...');
    const imageFileName = `${tokenData.symbol.toLowerCase()}-${Date.now()}.png`;
    const imageUploadResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/upload-to-github`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
      },
      body: JSON.stringify({
        type: 'image',
        fileName: imageFileName,
        content: tokenData.imageBase64,
      }),
    });

    if (!imageUploadResponse.ok) {
      throw new Error('Failed to upload image to GitHub');
    }

    const imageResult = await imageUploadResponse.json();
    console.log('✅ Image uploaded:', imageResult.url);

    // Step 2: Upload metadata to GitHub
    console.log('📝 Creating metadata on GitHub...');
    const metadataFileName = `${tokenData.symbol.toLowerCase()}-${Date.now()}.json`;
    const metadataUploadResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/upload-to-github`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
      },
      body: JSON.stringify({
        type: 'metadata',
        fileName: metadataFileName,
        metadata: {
          name: tokenData.name,
          symbol: tokenData.symbol,
          description: tokenData.description,
          image: imageResult.url,
        },
      }),
    });

    if (!metadataUploadResponse.ok) {
      throw new Error('Failed to upload metadata to GitHub');
    }

    const metadataResult = await metadataUploadResponse.json();
    console.log('✅ Metadata uploaded:', metadataResult.url);

    // Step 3: Create token mint with metadata URI
    console.log('🪙 Creating token mint with metadata...');
    const freezeAuthority = tokenData.revokeFreeze ? null : platformKeypair.publicKey;
    
    const mint = await createMint(
      connection,
      platformKeypair, // payer
      platformKeypair.publicKey, // mint authority
      freezeAuthority, // freeze authority
      tokenData.decimals,
    );

    console.log('✅ Token mint created:', mint.toBase58());

    // Step 4: Create token account for user
    console.log('📦 Creating token account for user...');
    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      platformKeypair, // payer
      mint,
      userPublicKey,
    );

    console.log('✅ User token account:', userTokenAccount.address.toBase58());

    // Step 5: Mint supply to user
    const supplyAmount = BigInt(tokenData.supply) * BigInt(10 ** tokenData.decimals);
    console.log('🎨 Minting supply to user:', supplyAmount.toString());
    
    const mintSignature = await mintTo(
      connection,
      platformKeypair, // payer
      mint,
      userTokenAccount.address,
      platformKeypair.publicKey, // mint authority
      supplyAmount,
    );

    console.log('✅ Tokens minted:', mintSignature);

    // Step 6: Revoke mint authority if requested
    if (tokenData.revokeMint) {
      console.log('🔒 Revoking mint authority...');
      await setAuthority(
        connection,
        platformKeypair, // payer
        mint,
        platformKeypair.publicKey, // current authority
        AuthorityType.MintTokens,
        null, // revoke (set to null)
      );
      console.log('✅ Mint authority revoked');
    }

    return new Response(
      JSON.stringify({
        success: true,
        mintAddress: mint.toBase58(),
        userTokenAccount: userTokenAccount.address.toBase58(),
        mintSignature,
        metadataUri: metadataResult.url,
        imageUri: imageResult.url,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('❌ Error creating token:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
