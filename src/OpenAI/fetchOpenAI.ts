import { isMock, mockFetch } from "./mock.ts";
import { rewriteUrl } from "./rewriteUrl.ts";
import type { Env } from "../types.ts";
import { useEnvValue } from "utils/Env.ts";

export const fetchOpenAI = (
  request: Request,
  env: Env,
  authorization: string,
  body: string | ReadableStream | null,
) => {
  const base = useEnvValue(env, "OPENAI_BASE", "");

  const upstreamUrlObject = rewriteUrl(request, base);

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
