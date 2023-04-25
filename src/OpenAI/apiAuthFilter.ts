import { Env } from "../types";
import { useEnvValue, useEnvValues } from "../utils/Env";
import { getHeader } from "../utils/getHeader";

const fromKeyConfig = (env: Env, authHeader: string) => {
  const prefix = "KEY ";
  if (!authHeader.startsWith(prefix)) {
    return "";
  }

  const authKeys = useEnvValues(env, "SECRET_AUTH_KEYS");

  const stripKey = authHeader.slice(prefix.length).trimEnd();

  const isAuth = authKeys.includes(stripKey);

  if (!isAuth) {
    return "";
  }

  const apiKey = useEnvValue(env, "SECRET_OPENAI_API_KEY", "");

  return `Bearer ${apiKey}`;
};

const passThrough = (authHeader: string) => {
  if (authHeader.startsWith("Bearer ")) {
    return authHeader;
  }

  return "";
};

export const apiAuthFilter = (
  env: Env,
  request: Request,
): [string, string] => {
  const authHeader = getHeader(request, "Authorization") || "";

  const apiAuth = fromKeyConfig(env, authHeader) || passThrough(authHeader);

  if (!apiAuth) {
    return [apiAuth, "Access denied"];
  }

  // valid
  return [apiAuth, ""];
};
