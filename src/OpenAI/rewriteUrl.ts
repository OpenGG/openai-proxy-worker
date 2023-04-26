export const rewriteUrl = (request: Request, base: string) => {
  const url = new URL(request.url);

  const upstreamUrl = new URL(base);

  const newPathname = `${upstreamUrl.pathname}/${url.pathname}`.replace(
    /\/+/,
    "/",
  );

  upstreamUrl.pathname = newPathname;
  upstreamUrl.search = url.search;

  return upstreamUrl;
};
