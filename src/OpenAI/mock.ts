import { getHeader } from "utils/getHeader.ts";

export const isMock = (request: Request) =>
  getHeader(request, "x-mock") === "1";

export const mockFetch = async (request: Request) => {
  const {
    url,
    method,
    headers,
    body,
  } = request;

  const echoHeaders: Record<string, string> = {};

  headers.forEach((v, k) => {
    echoHeaders[k] = v;
  });

  let echoBody = "";
  if (!body) {
    // ignore
  } else if (typeof body === "object") {
    // readable stream
    echoBody = await request.text();
  }

  return new Response(
    JSON.stringify({
      url,
      method,
      headers: echoHeaders,
      body: echoBody,
    }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
        "x-mock-response": "1",
      },
    },
  );
};
