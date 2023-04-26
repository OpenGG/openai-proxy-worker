import { Env } from "../types.ts";

const symbolRegistry = Symbol("registry") as unknown as keyof Env;

export const getLazy = <T>(env: Env, key: string, init: (env: Env) => T) => {
  let registry: Map<string, unknown> = env[symbolRegistry] as unknown as Map<
    string,
    unknown
  >;

  if (!registry) {
    registry = new Map();
    (env[symbolRegistry] as unknown) = registry;
  }

  if (registry.has(key)) {
    return registry.get(key) as T;
  }

  const val = init(env);

  registry.set(key, val);

  return val;
};
