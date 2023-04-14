import { IMiddlewareCreator } from "../types";

const mapUrl = (request: Request, base: string) => {
  const url = new URL(request.url);

  const upstreamUrl = new URL(base);

  const newPathname = `${upstreamUrl.pathname}/${url.pathname}`.replace(
    /\/+/,
    "/",
  );

  upstreamUrl.pathname = newPathname;
  upstreamUrl.search = request.url;

  return upstreamUrl;
};

type IProxyArgs = [hostname: string, modifyHeaders: (headers: Headers) => void];

export const ProxyRoute: IMiddlewareCreator<IProxyArgs> =
  (base, modifyHeaders) => async (request: Request) => {
    const upstreamUrl = mapUrl(request, base);

    const {
      method,
      headers,
    } = request;

    const upstreamHeaders = new Headers(headers);

    modifyHeaders(upstreamHeaders);

    const req = new Request(upstreamUrl.href, {
      method,
      headers: upstreamHeaders,
      body: request.body,
    });

    return fetch(req);
  };
