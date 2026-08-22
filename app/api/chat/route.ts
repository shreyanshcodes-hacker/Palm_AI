import { handlePalmChatRequest, ChatRequestPayload } from '../../../src/server/xaiChatService';

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
    console.error('[App Router /api/chat error]:', error);
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
