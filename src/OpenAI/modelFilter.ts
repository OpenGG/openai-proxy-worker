import { Env } from "../types";
import { useEnvValues } from "../utils/Env";

const isModelAllowed = (env: Env, model: string) => {
  const allowed = useEnvValues(env, "ENV_OPENAI_ALLOWED_MODELS");

  return allowed.includes(model);
};

export const modelFilter = (
  env: Env,
  data: {},
): [boolean, string] => {
  const model = (data as unknown as any)?.model || "";

  if (!isModelAllowed(env, model)) {
    return [false, "Model not allowed"];
  }

  // valid
  return [true, ""];
};
