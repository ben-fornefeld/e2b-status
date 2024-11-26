import Sandbox from "@e2b/code-interpreter";

export const runtime = "edge";

const API_TEST_COUNT = 100;

async function runCheck(sandbox: Sandbox) {
  const startTime = Date.now();

  await sandbox.runCode("print('Hello, world!')");

  const responseTime = Date.now() - startTime;

  return {
    response_time_ms: responseTime,
    timestamp: Date.now(),
  };
}

export async function GET() {
  try {
    const sandbox = await Sandbox.create();

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for (let i = 0; i < API_TEST_COUNT; i++) {
            const result = await runCheck(sandbox);
            controller.enqueue(encoder.encode(JSON.stringify(result) + "\n"));
          }
        } catch (error) {
          console.error(error);
          controller.error(error);
        } finally {
          await sandbox.kill();
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}
