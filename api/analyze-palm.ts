import { handlePalmAnalyzeRequest, AnalyzePalmPayload } from '../src/server/palmAnalyzeService';

// Vercel Serverless Function Handler
export default async function handler(req: any, res: any) {
  // Enable CORS
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

  // GET /api/analyze-palm - Health check
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      service: 'PalmAI Analysis API',
    });
  }

  // POST /api/analyze-palm - Analyze palm image
  if (req.method === 'POST') {
    try {
      let body: AnalyzePalmPayload = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          return res.status(400).json({
            source: 'validation',
            error: 'Invalid JSON body.',
          });
        }
      }

      const result = await handlePalmAnalyzeRequest(body || {});
      return res.status(result.status).json(result.body);
    } catch (error: any) {
      console.error('[Vercel API /api/analyze-palm error]:', error);
      return res.status(500).json({
        source: 'error',
        error: 'Unable to analyze palm image right now.',
      });
    }
  }

  return res.status(405).json({
    error: `Method ${req.method} Not Allowed`,
  });
}

// Edge / Web Standard API Handlers for Vercel
export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'PalmAI Analysis API',
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
    const body = (await request.json()) as AnalyzePalmPayload;
    const result = await handlePalmAnalyzeRequest(body || {});
    return new Response(JSON.stringify(result.body), {
      status: result.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    console.error('[Web Handler /api/analyze-palm error]:', error);
    return new Response(
      JSON.stringify({
        source: 'error',
        error: 'Unable to analyze palm image right now.',
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
