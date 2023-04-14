import { Env } from "../types";
import { useEnvValues } from "../utils/Env";
import { getHeader } from "../utils/getHeader";

const isAuth = (env: Env, key: string) => {
  const authKeys = useEnvValues(env, "SECRET_AUTH_KEYS");

  const stripKey = key.replace(/^KEY /, "").trim();

  return authKeys.includes(stripKey);
};

export const authFilter = (env: Env, request: Request): [boolean, string] => {
  const authKey = getHeader(request, "Authorization") || "";

  const valid = isAuth(env, authKey);

  if (!valid) {
    return [false, "Access denied"];
  }

  // valid
  return [true, ""];
};
