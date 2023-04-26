import { Env } from "../types.ts";
import { useEnvValue, useEnvValues } from "../utils/Env.ts";
import { getHeader } from "../utils/getHeader.ts";

enum IAuthMode {
  proxy = 0,
  passthrough = 1,
  none = -1,
}

export const AuthMode: Record<string, IAuthMode> = {
  proxy: 0,
  passThrough: 1,
  none: -1,
}

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

const passthrough = (authHeader: string) => {
  if (authHeader.startsWith("Bearer ")) {
    return authHeader;
  }

  return "";
};

export const apiAuthFilter = (
  env: Env,
  request: Request,
): [IAuthMode, string] => {
  const authHeader = getHeader(request, "Authorization") || "";

  const apiAuth = fromKeyConfig(env, authHeader);
  if (apiAuth) {
    return [AuthMode.proxy, apiAuth];
  }

  const passAuth = passthrough(authHeader);

  if (passAuth) {
    return [AuthMode.passthrough, passAuth];
  }

  return [AuthMode.none, ""];
};
