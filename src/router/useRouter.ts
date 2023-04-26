import type { Env, IMiddleware } from "../types.ts";
import { Router } from "itty-router";
import { getLazy } from "../utils/getLazy.ts";
import { OPENAI_ROUTES, RESOURCE_NOT_FOUND } from "../constants.ts";
import { proxyRoute } from "../OpenAI/proxyRoute.ts";
import { ErrorResponse } from "../utils/ErrorResponse.ts";

const route404: IMiddleware = () =>
  ErrorResponse("Not Found", RESOURCE_NOT_FOUND);

export const useRouter = (env: Env) =>
  getLazy(env, "router", (env) => {
    const router = Router();

    OPENAI_ROUTES.forEach((route) => {
      // @ts-ignore
      router.all(route, proxyRoute);
    });

    // @ts-ignore
    router.all("*", route404);

    return router;
  });
