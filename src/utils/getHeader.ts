export const getHeader = (request: Request, key: string) =>
  request.headers?.get(key);
