import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN');
const GITHUB_REPO = Deno.env.get('GITHUB_REPO') || 'username/memecoin-assets';
const GITHUB_BRANCH = Deno.env.get('GITHUB_BRANCH') || 'main';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UploadRequest {
  type: 'image' | 'metadata';
  fileName: string;
  content: string; // base64 for images, JSON string for metadata
  metadata?: {
    name: string;
    symbol: string;
    description: string;
    imageUrl: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!GITHUB_TOKEN) {
      throw new Error('GitHub token not configured');
    }

    const { type, fileName, content, metadata }: UploadRequest = await req.json();

    let fileContent: string;
    let filePath: string;

    if (type === 'image') {
      // Upload image
      filePath = `images/${fileName}`;
      // Content is already base64 from the client
      fileContent = content.split(',')[1] || content; // Remove data:image/...;base64, if present
    } else if (type === 'metadata') {
      // Create and upload metadata JSON
      filePath = `metadata/${fileName}`;
      const baseJson: any = {
        name: metadata!.name,
        symbol: metadata!.symbol,
        description: metadata!.description,
        image: metadata!.imageUrl,
        properties: {
          files: [
            {
              uri: metadata!.imageUrl,
              type: "image/png"
            }
          ]
        }
      };
      const metadataJson = (metadata && (metadata as any).extensions)
        ? { ...baseJson, extensions: (metadata as any).extensions }
        : baseJson;
      fileContent = btoa(JSON.stringify(metadataJson, null, 2));
    } else {
      throw new Error('Invalid upload type');
    }

    // Upload to GitHub
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: `Add ${fileName}`,
        content: fileContent,
        branch: GITHUB_BRANCH,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`GitHub API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    // Return the raw GitHub URL
    const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${filePath}`;

    return new Response(
      JSON.stringify({ 
        success: true, 
        url: rawUrl,
        sha: data.content?.sha 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    );

  } catch (error) {
    console.error('Error uploading to GitHub:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      },
    );
  }
});
