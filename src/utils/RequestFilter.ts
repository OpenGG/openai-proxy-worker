import type { IMiddlewareArgs, IMiddlewareCreator } from "../types";

type IFilter = (...args: IMiddlewareArgs) => [number, string] | void;

export const RequestFilter: IMiddlewareCreator<[IFilter]> =
  (filter: IFilter) => (...args: IMiddlewareArgs) => {
    const res = filter(...args);

    if (!res) {
      // pass to next middleware
      return;
    }

    const [status, message] = res;

    return new Response(message || "Unknown server error", {
      status: status || 500,
    });
  };
