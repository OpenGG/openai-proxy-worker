import type { Env } from "../types";
import { getLazy } from "./getLazy";

export const useEnvValue = (env: Env, key: keyof Env, defaults: string) => env[key] || defaults;

export const useEnvValues = (env: Env, key: keyof Env) => {
  const values = getLazy(env, key, (env) => {
    const secret = env[key];

    return secret.split(",").map((s) => s.trim()).filter((s) => s);
  });

  return values;
};
