import {
  HandlerContext,
  HandlerEvent,
  HandlerResponse
} from "@netlify/functions";

export async function handler(
  event: HandlerEvent,
  context: HandlerContext
): Promise<HandlerResponse> {
  const response: HandlerResponse = {
    statusCode: 200,
    body: JSON.stringify(event)
  };

  return response;
}
