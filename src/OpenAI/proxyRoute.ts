import {
  CLIENT_BAD_REQUEST,
  CLIENT_FORBIDDEN,
  CLIENT_UNAUTHORIZED,
  OPENAI_BASE,
  OPENAI_REQUEST_SIZE_LIMIT,
} from "../constants";
import { IMiddleware } from "../types";
import { useEnvValue } from "../utils/Env";
import { ErrorResponse } from "../utils/ErrorResponse";
import { authFilter } from "./authFilter";
import { jsonFilter } from "./jsonFilter";
import { modelFilter } from "./modelFilter";
import { rewriteUrl } from "./rewriteUrl";

export const proxyRoute: IMiddleware = async (request, env) => {
  // checking starts
  const [isAuth, authMsg] = authFilter(env, request);

  if (!isAuth) {
    return ErrorResponse(authMsg, CLIENT_UNAUTHORIZED);
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

  return ErrorResponse("201", 201);
  // checking ends

  // prepare request
  const upstreamUrl = rewriteUrl(request, OPENAI_BASE);

  const {
    method,
    headers,
  } = request;

  const upstreamHeaders = new Headers(headers);

  const apiKey = useEnvValue(env, "SECRET_OPENAI_API_KEY", "");

  upstreamHeaders.set("Authorization", `Bearer ${apiKey}`);

  const req = new Request(upstreamUrl.href, {
    method,
    headers: upstreamHeaders,
    body: text,
  });

  // prepare request ends

  return fetch(req);
};
