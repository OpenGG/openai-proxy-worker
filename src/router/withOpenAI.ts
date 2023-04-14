import { Router } from "itty-router";
import { OPENAI_BASE, OPENAI_ROUTES } from "../config";
import { RequestFilter } from "../utils/RequestFilter";
import { useAuth } from "../utils/Auth";
import { ProxyRoute } from "../utils/ProxyRoute";
import { Env } from "../types";

const authFilter = RequestFilter((request, env) => {
  const authKey = request.headers?.get("Authorization") || "";

  const isAuth = useAuth(env).isAuth(authKey);

  if (!isAuth) {
    return [401, "Access denied"];
  }

  // valid
  return;
});

export const withOpenAI = (router: Router, env: Env) => {
  const apiKey = env.SECRET_OPENAI_API_KEY || "";

  const upstreamRoute = ProxyRoute(
    OPENAI_BASE,
    (reqHeaders) => {
      reqHeaders.set("Authorization", `Bearer ${apiKey}`);
    },
  );

  OPENAI_ROUTES.forEach((route) => {
    router.all(route, authFilter, upstreamRoute);
  });
};
