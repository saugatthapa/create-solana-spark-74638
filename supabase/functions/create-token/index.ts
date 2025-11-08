import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Connection, Keypair, PublicKey, SystemProgram } from "npm:@solana/web3.js@1.98.4";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, setAuthority, AuthorityType } from "npm:@solana/spl-token@0.4.14";
import bs58 from "https://esm.sh/bs58@5.0.0";
import { createUmi } from "npm:@metaplex-foundation/umi-bundle-defaults";
import { createV1, mplTokenMetadata, TokenStandard } from "npm:@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey as umiPublicKey, percentAmount } from "npm:@metaplex-foundation/umi";
import { fromWeb3JsKeypair } from "npm:@metaplex-foundation/umi-web3js-adapters";
import { base58 as umiBase58 } from "npm:@metaplex-foundation/umi/serializers";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PLATFORM_WALLET_PRIVATE_KEY = Deno.env.get('PLATFORM_WALLET_PRIVATE_KEY');
// RPC will be selected per-request

interface CreateTokenRequest {
  userWallet: string;
  paymentSignature: string;
  network?: 'devnet' | 'mainnet-beta';
  tokenData: {
    name: string;
    symbol: string;
    decimals: number;
    supply: string;
    description: string;
    imageBase64: string;
    revokeFreeze: boolean;
    revokeMint: boolean;
    telegram?: string;
    website?: string;
    twitter?: string;
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

    const { userWallet, paymentSignature, tokenData, network }: CreateTokenRequest = await req.json();

    const SOLANA_RPC_URL = network === 'devnet' ? 'https://api.devnet.solana.com' : 'https://api.mainnet-beta.solana.com';

    console.log('🚀 Starting token creation for user:', userWallet, 'on', network ?? 'mainnet-beta');

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

    // Get account keys for versioned transaction
    const accountKeys = paymentTx.transaction.message.getAccountKeys({
      accountKeysFromLookups: paymentTx.meta?.loadedAddresses
    });

    // Find the SOL transfer instruction by checking the program ID
    const message = paymentTx.transaction.message;
    const compiledInstructions = 'compiledInstructions' in message 
      ? message.compiledInstructions 
      : (message as any).instructions;

    let transferInstruction: any = null;
    let instructionAccountKeys: number[] | null = null;

    for (const ix of compiledInstructions) {
      const programId = accountKeys.get(ix.programIdIndex);
      if (programId && programId.equals(SystemProgram.programId)) {
        transferInstruction = ix;
        instructionAccountKeys = ix.accountKeyIndexes || ix.accounts;
        break;
      }
    }

    if (!transferInstruction || !instructionAccountKeys) {
      throw new Error('No transfer instruction found in payment transaction');
    }

    // Get the accounts involved in the transfer
    const fromAccount = accountKeys.get(instructionAccountKeys[0]);
    const toAccount = accountKeys.get(instructionAccountKeys[1]);

    if (!fromAccount || !toAccount) {
      throw new Error('Could not resolve transfer accounts');
    }

    console.log('📝 Transfer from:', fromAccount.toBase58());
    console.log('📝 Transfer to:', toAccount.toBase58());
    console.log('📝 Platform wallet:', platformKeypair.publicKey.toBase58());

    // Verify the payment is to the platform wallet
    if (!toAccount.equals(platformKeypair.publicKey)) {
      throw new Error('Payment was not sent to platform wallet');
    }

    // Decode the transfer amount from instruction data
    // SystemProgram.transfer instruction data format: [u32 instruction_type, u64 lamports]
    const instructionData = new Uint8Array(transferInstruction.data);
    if (instructionData.length < 12) {
      throw new Error('Invalid transfer instruction data');
    }

    // Read lamports as little-endian u64 (skip first 4 bytes which is instruction type)
    const lamportsBuffer = instructionData.slice(4, 12);
    let transferAmount = 0;
    for (let i = 0; i < 8; i++) {
      transferAmount += lamportsBuffer[i] * Math.pow(256, i);
    }

    console.log('💰 Transfer amount:', transferAmount / 1_000_000_000, 'SOL');

    const REQUIRED_PAYMENT = 0.15 * 1_000_000_000; // 0.15 SOL in lamports (fixed price for all options)
    if (transferAmount < REQUIRED_PAYMENT) {
      throw new Error(`Invalid payment amount: ${transferAmount / 1_000_000_000} SOL (required: 0.15 SOL)`);
    }

    console.log('✅ Payment verified: 0.15 SOL from user', userPublicKey.toBase58());

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
    
    const extensions: any = {};
    if (tokenData.website) extensions.website = tokenData.website;
    if (tokenData.twitter) extensions.twitter = tokenData.twitter;
    if (tokenData.telegram) extensions.telegram = tokenData.telegram;
    if (tokenData.revokeMint) {
      extensions.revokeMint = true;
      extensions.mintAuthorityPrice = "0.05";
    }

    const metadataPayload: any = {
      name: tokenData.name,
      symbol: tokenData.symbol,
      description: tokenData.description,
      imageUrl: imageResult.url,
      ...(Object.keys(extensions).length > 0 ? { extensions } : {}),
    };
    
    const metadataUploadResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/upload-to-github`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
      },
      body: JSON.stringify({
        type: 'metadata',
        fileName: metadataFileName,
        metadata: metadataPayload,
      }),
    });

    if (!metadataUploadResponse.ok) {
      throw new Error('Failed to upload metadata to GitHub');
    }

    const metadataResult = await metadataUploadResponse.json();
    console.log('✅ Metadata uploaded:', metadataResult.url);

    // Step 3: Generate mint keypair and create token with metadata using Metaplex
    console.log('🪙 Generating mint keypair...');
    const mintKeypair = Keypair.generate();
    console.log('✅ Mint will be:', mintKeypair.publicKey.toBase58());

    // Initialize UMI for Metaplex
    console.log('📝 Creating token and metadata with Metaplex...');
    const umi = createUmi(SOLANA_RPC_URL)
      .use(mplTokenMetadata());

    // Convert Web3.js keypairs to UMI format
    const umiPlatformKeypair = fromWeb3JsKeypair(platformKeypair);
    const umiMintKeypair = fromWeb3JsKeypair(mintKeypair);
    const umiPlatformSigner = createSignerFromKeypair(umi, umiPlatformKeypair);
    const umiMintSigner = createSignerFromKeypair(umi, umiMintKeypair);
    const umiUserPublicKey = umiPublicKey(userPublicKey.toBase58());
    umi.use(signerIdentity(umiPlatformSigner));

    // Create mint and metadata with PLATFORM as all authorities initially
    // We'll transfer them to user after minting is complete
    console.log('📝 Creating token with platform authorities...');
    const createArgs: any = {
      mint: umiMintSigner,
      authority: umiPlatformSigner,
      payer: umiPlatformSigner,
      updateAuthority: umiPlatformSigner.publicKey, // Platform initially
      name: tokenData.name,
      symbol: tokenData.symbol,
      uri: metadataResult.url,
      sellerFeeBasisPoints: percentAmount(0),
      tokenStandard: TokenStandard.Fungible,
      decimals: tokenData.decimals,
      mintAuthority: umiPlatformSigner.publicKey, // Platform initially
    };

    // Always set freeze authority to platform initially; will transfer to user later
    createArgs.freezeAuthority = umiPlatformSigner.publicKey;

    const tx = await createV1(umi, createArgs).sendAndConfirm(umi);

    const txSig = umiBase58.deserialize(tx.signature)[0];
    const mint = mintKeypair.publicKey;
    console.log('✅ Token and metadata created:', mint.toBase58());
    console.log('✅ Transaction signature:', txSig);

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
    console.log('🎨 Minting', supplyAmount.toString(), 'tokens to user:', userPublicKey.toBase58());
    
    const mintSignature = await mintTo(
      connection,
      platformKeypair, // payer
      mint,
      userTokenAccount.address,
      platformKeypair, // platform has mint authority at this point
      supplyAmount,
    );

    console.log('✅ Tokens minted to user wallet');

    // Step 6: Transfer authorities to user based on their choices
    console.log('🔑 Transferring authorities to user wallet:', userPublicKey.toBase58());
    
    // Handle mint authority
    if (tokenData.revokeMint) {
      console.log('🔒 Revoking mint authority (no one can mint more tokens)...');
      await setAuthority(
        connection,
        platformKeypair,
        mint,
        platformKeypair.publicKey,
        AuthorityType.MintTokens,
        null, // revoke
      );
      console.log('✅ Mint authority revoked permanently');
    } else {
      console.log('🔑 Transferring mint authority to user wallet...');
      await setAuthority(
        connection,
        platformKeypair,
        mint,
        platformKeypair.publicKey,
        AuthorityType.MintTokens,
        userPublicKey,
      );
      console.log('✅ Mint authority transferred to:', userPublicKey.toBase58());
    }

    // Handle freeze authority - always transfer to user
    console.log('🔑 Transferring freeze authority to user wallet...');
    await setAuthority(
      connection,
      platformKeypair,
      mint,
      platformKeypair.publicKey,
      AuthorityType.FreezeAccount,
      userPublicKey,
    );
    console.log('✅ Freeze authority transferred to:', userPublicKey.toBase58());

    console.log('✅ All authorities configured successfully');

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
    
    // Better error serialization
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error);
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
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
