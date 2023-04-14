import { Env } from "../types";

const symbolRegistry = Symbol("registry");

export const BindEnv = <T>(key: string, init: (env: Env) => T) => {
  const handleEnv = (env: Env) => {
    let registry: Map<string, any> = env[symbolRegistry];

    if (!registry) {
      registry = env[symbolRegistry] = new Map();
    }

    if (registry.has(key)) {
      return registry.get(key) as T;
    }

    const val = init(env);

    registry.set(key, val);

    return val;
  };

  return handleEnv;
};
