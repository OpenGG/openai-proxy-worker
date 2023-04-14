import type { Env, IMiddleware } from "../types";
import { Router } from "itty-router";
import { getLazy } from "../utils/getLazy";
import { OPENAI_ROUTES, RESOURCE_NOT_FOUND } from "../constants";
import { proxyRoute } from "../OpenAI/proxyRoute";
import { ErrorResponse } from "../utils/ErrorResponse";

const route404: IMiddleware = () =>
  ErrorResponse("Not found", RESOURCE_NOT_FOUND);

export const useRouter = (env: Env) =>
  getLazy(env, "router", (env) => {
    const router = Router();

    OPENAI_ROUTES.forEach((route) => {
      router.all(route, proxyRoute);
    });

    router.all("*", route404);

    return router;
  });
