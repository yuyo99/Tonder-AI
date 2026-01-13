import { NextRequest } from "next/server";

// This is a Server-Sent Events (SSE) endpoint for real-time updates
// In production, you would connect this to a message queue or change stream

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const connectionMessage = `data: ${JSON.stringify({
        type: "connection",
        status: "connected",
        timestamp: new Date().toISOString(),
      })}\n\n`;
      controller.enqueue(encoder.encode(connectionMessage));

      // Simulate real-time updates every 5 seconds
      const interval = setInterval(() => {
        const eventTypes = ["transaction", "withdrawal", "alert"];
        const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];

        let eventData;

        switch (type) {
          case "transaction":
            eventData = {
              type: "transaction",
              action: "created",
              data: {
                transactionId: `TXN-${Date.now().toString(36).toUpperCase()}`,
                merchantName: ["TechMart Mexico", "Fashion Hub", "Gourmet Delights"][
                  Math.floor(Math.random() * 3)
                ],
                amount: Math.floor(Math.random() * 50000) + 100,
                status: Math.random() > 0.05 ? "completed" : "failed",
                paymentMethod: ["card", "spei", "oxxo"][Math.floor(Math.random() * 3)],
                createdAt: new Date().toISOString(),
              },
              timestamp: new Date().toISOString(),
            };
            break;

          case "withdrawal":
            eventData = {
              type: "withdrawal",
              action: "updated",
              data: {
                withdrawalId: `WDL-${Date.now().toString(36).toUpperCase()}`,
                merchantName: ["TechMart Mexico", "Fashion Hub"][
                  Math.floor(Math.random() * 2)
                ],
                amount: Math.floor(Math.random() * 500000) + 10000,
                status: ["pending", "processing", "completed"][
                  Math.floor(Math.random() * 3)
                ],
              },
              timestamp: new Date().toISOString(),
            };
            break;

          case "alert":
            eventData = {
              type: "alert",
              action: "created",
              data: {
                title: ["Success Rate Alert", "High Volume Detected", "Processing Delay"][
                  Math.floor(Math.random() * 3)
                ],
                severity: ["low", "medium", "high", "critical"][
                  Math.floor(Math.random() * 4)
                ],
                message: "New alert triggered based on threshold configuration",
              },
              timestamp: new Date().toISOString(),
            };
            break;
        }

        const message = `data: ${JSON.stringify(eventData)}\n\n`;
        controller.enqueue(encoder.encode(message));
      }, 5000);

      // Handle client disconnect
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
