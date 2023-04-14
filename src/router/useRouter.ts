import type { IMiddleware } from "../types";
import { Router } from "itty-router";
import { BindEnv } from "../utils/BindEnv";
import { withOpenAI } from "./withOpenAI";

const route404: IMiddleware = () => new Response(null, { status: 404 });

export const useRouter = BindEnv("router", (env) => {
  const router = Router();

  withOpenAI(router, env);

  router.all("*", route404);

  return router;
});
