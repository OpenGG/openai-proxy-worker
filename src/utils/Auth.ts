import { BindEnv } from "../utils/BindEnv";

export const useAuth = BindEnv("auth", (env) => {
  const secret = env.SECRET_AUTH_KEYS;

  const authKeys = secret.split(",").map((s) => s.trim()).filter((s) => s);

  const isAuth = (key: string) => {
    const stripKey = key.replace(/^KEY /, "").trim();

    return authKeys.includes(stripKey);
  };

  return {
    isAuth,
  };
});
