import {
  CLIENT_BAD_REQUEST,
  CLIENT_FORBIDDEN,
  CLIENT_UNAUTHORIZED,
  OPENAI_REQUEST_SIZE_LIMIT,
} from "../constants.ts";
import type { Env, IMiddleware } from "../types.ts";
import { ErrorResponse } from "../utils/ErrorResponse.ts";
import { apiAuthFilter, AuthMode } from "./apiAuthFilter.ts";
import { fetchOpenAI } from "./fetchOpenAI.ts";
import { jsonFilter } from "./jsonFilter.ts";
import { modelFilter } from "./modelFilter.ts";

const passthroughStream = (request: Request, authHeader: string) =>
  fetchOpenAI(request, authHeader, request.body);

const proxyStream = async (request: Request, env: Env, authHeader: string) => {
  // check json
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

  // check model
  const [isAllowed, modelMsg] = modelFilter(env, json);

  if (!isAllowed) {
    return ErrorResponse(modelMsg, CLIENT_FORBIDDEN);
  }

  return fetchOpenAI(request, authHeader, text);
};

export const proxyRoute: IMiddleware = async (request, env) => {
  const [authMode, authHeader] = apiAuthFilter(env, request);

  if (authMode === AuthMode.proxy) {
    return proxyStream(request, env, authHeader);
  }

  if (authMode === AuthMode.passthrough) {
    return passthroughStream(request, authHeader);
  }

  return ErrorResponse("Access denied", CLIENT_UNAUTHORIZED);
};
