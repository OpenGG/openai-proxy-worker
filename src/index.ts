// NOTE: this import only required during beta. Types will be available
// on @cloudflare/workers-types after launch

import type { Env } from "./types";
import { useRouter } from "./router/useRouter";

const fetch: ExportedHandlerFetchHandler<Env> = (
  request,
  env,
  ctx,
): Promise<Response> => useRouter(env).handle(request, env, ctx);

export default {
  fetch,
};
