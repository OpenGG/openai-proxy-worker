import { Env } from "../types";

const symbolRegistry = Symbol("registry");

export const getLazy = <T>(env: Env, key: string, init: (env: Env) => T) => {
  let registry: Map<string, unknown> = env[symbolRegistry];

  if (!registry) {
    registry = env[symbolRegistry] = new Map();
  }

  if (registry.has(key)) {
    return registry.get(key) as T;
  }

  const val = init(env);

  registry.set(key, val);

  return val;
}