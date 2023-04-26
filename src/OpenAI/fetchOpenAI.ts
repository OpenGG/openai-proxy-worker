import { OPENAI_BASE } from "../constants.ts";
import { isMock, mockFetch } from "./mock.ts";
import { rewriteUrl } from "./rewriteUrl.ts";

export const fetchOpenAI = (
  request: Request,
  authorization: string,
  body: string | ReadableStream | null,
) => {
  const upstreamUrlObject = rewriteUrl(request, OPENAI_BASE);

  const upstreamUrl = upstreamUrlObject.href

  const {
    method,
    headers,
  } = request;

  const upstreamHeaders = new Headers(headers);

  upstreamHeaders.set("Authorization", authorization);

  const req = new Request(upstreamUrl, {
    method,
    headers: upstreamHeaders,
    body,
  });

  if (isMock(req)) {
    return mockFetch(req)
  }

  return fetch(req);
};
