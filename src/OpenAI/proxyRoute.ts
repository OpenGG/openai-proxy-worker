import {
  CLIENT_BAD_REQUEST,
  CLIENT_FORBIDDEN,
  CLIENT_UNAUTHORIZED,
  OPENAI_BASE,
  OPENAI_REQUEST_SIZE_LIMIT,
} from "../constants";
import { IMiddleware } from "../types";
import { ErrorResponse } from "../utils/ErrorResponse";
import { apiAuthFilter } from "./apiAuthFilter";
import { jsonFilter } from "./jsonFilter";
import { modelFilter } from "./modelFilter";
import { rewriteUrl } from "./rewriteUrl";

export const proxyRoute: IMiddleware = async (request, env) => {
  // checking starts
  const [apiAuth, apiAuthMsg] = apiAuthFilter(env, request);

  if (!apiAuth) {
    return ErrorResponse(apiAuthMsg, CLIENT_UNAUTHORIZED);
  }

  const [isValid, text, json] = await jsonFilter<{}>(
    request,
    OPENAI_REQUEST_SIZE_LIMIT,
  );

  if (isValid === false) {
    return ErrorResponse(text, CLIENT_BAD_REQUEST);
  }

  if (typeof json !== "object") {
    return ErrorResponse("Invalid json format", CLIENT_BAD_REQUEST);
  }

  const [isAllowed, modelMsg] = modelFilter(env, json);

  if (!isAllowed) {
    return ErrorResponse(modelMsg, CLIENT_FORBIDDEN);
  }

  // checking ends

  // prepare request
  const upstreamUrl = rewriteUrl(request, OPENAI_BASE);

  const {
    method,
    headers,
  } = request;

  const upstreamHeaders = new Headers(headers);

  upstreamHeaders.set("Authorization", apiAuth);

  const req = new Request(upstreamUrl.href, {
    method,
    headers: upstreamHeaders,
    body: text,
  });

  // prepare request ends

  return fetch(req);
};
