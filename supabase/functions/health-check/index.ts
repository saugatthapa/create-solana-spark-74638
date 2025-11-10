import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Connection } from "npm:@solana/web3.js@1.98.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const checks: any = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      checks: {},
    };

    // Check environment variables
    checks.checks.env = {
      mainnetRpcConfigured: !!Deno.env.get('MAINNET_RPC_URL'),
      mainnetWalletConfigured: !!Deno.env.get('PLATFORM_WALLET_PRIVATE_KEY'),
      devnetWalletConfigured: !!Deno.env.get('PLATFORM_WALLET_PRIVATE_KEY_DEVNET'),
      supabaseConfigured: !!Deno.env.get('SUPABASE_URL'),
      githubConfigured: !!Deno.env.get('GITHUB_TOKEN'),
    };

    // Check RPC connectivity for both networks
    try {
      const devnetConnection = new Connection('https://api.devnet.solana.com', 'confirmed');
      await devnetConnection.getSlot();
      checks.checks.devnetRpc = { status: 'ok' };
    } catch (error) {
      checks.checks.devnetRpc = { status: 'error', message: String(error) };
      checks.status = 'degraded';
    }

    const mainnetRpcUrl = Deno.env.get('MAINNET_RPC_URL');
    if (mainnetRpcUrl) {
      try {
        const mainnetConnection = new Connection(mainnetRpcUrl, 'confirmed');
        await mainnetConnection.getSlot();
        checks.checks.mainnetRpc = { status: 'ok' };
      } catch (error) {
        checks.checks.mainnetRpc = { status: 'error', message: String(error) };
        checks.status = 'degraded';
      }
    }

    return new Response(
      JSON.stringify(checks),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: checks.status === 'healthy' ? 200 : 503,
      },
    );

  } catch (error) {
    console.error('Health check error:', error);
    return new Response(
      JSON.stringify({
        status: 'error',
        error: String(error),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});