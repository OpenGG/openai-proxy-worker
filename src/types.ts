export interface Env {
  OPENAI_BASE: string;

  ENV_OPENAI_ALLOWED_MODELS: string;

  SECRET_AUTH_KEYS: string;

  SECRET_OPENAI_API_KEY: string;
}

export type IMiddlewareArgs = [
  req: Request,
  env: Env,
  ctx: ExecutionContext,
];

export type IMiddleware = (
  ...args: IMiddlewareArgs
) => Response | Promise<Response>;

export interface IMiddlewareCreator<T extends unknown[]> {
  (...args: T): IMiddleware;
}
