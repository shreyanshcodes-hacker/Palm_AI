import { handlePalmChatRequest, ChatRequestPayload } from '../src/server/xaiChatService';

// Vercel Serverless Function Handler (Node.js runtime: req, res)
export default async function handler(req: any, res: any) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET /api/chat - Health check
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      service: 'PalmAI Chat API',
    });
  }

  // POST /api/chat - Grok Palm AI Chat
  if (req.method === 'POST') {
    try {
      let body: ChatRequestPayload = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          return res.status(400).json({
            success: false,
            error: 'Invalid JSON body.',
          });
        }
      }

      const result = await handlePalmChatRequest(body || {});
      return res.status(result.status).json(result.body);
    } catch (error: any) {
      console.error('[Vercel Serverless /api/chat Error]:', error);
      return res.status(500).json({
        success: false,
        error: 'Unable to generate response right now.',
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: `Method ${req.method} Not Allowed`,
  });
}

// Web Standard Handlers (Edge / Next.js API compatibility)
export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'PalmAI Chat API',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequestPayload;
    const result = await handlePalmChatRequest(body || {});
    return new Response(JSON.stringify(result.body), {
      status: result.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    console.error('[Web Handler /api/chat Error]:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Unable to generate response right now.',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
