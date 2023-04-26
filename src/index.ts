import type { Env } from "./types.ts";
import { useRouter } from "./router/useRouter.ts";

const fetch: ExportedHandlerFetchHandler<Env> = (
  request,
  env,
  ctx,
): Promise<Response> => useRouter(env).handle(request, env, ctx);

export default {
  fetch,
};
