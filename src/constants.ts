export const OPENAI_ROUTES = [
  "/v1/chat/completions",
  "/v1/completions",
];

// 1MB size limit
export const OPENAI_REQUEST_SIZE_LIMIT = 1 * 1024 * 1024;
// export const OPENAI_REQUEST_SIZE_LIMIT =  1024;

export const CLIENT_BAD_REQUEST = 400
export const CLIENT_UNAUTHORIZED = 401
export const CLIENT_FORBIDDEN = 403

export const RESOURCE_NOT_FOUND = 404

export const SERVER_UNKNOWN_ERROR = 500
