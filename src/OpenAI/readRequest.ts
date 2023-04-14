import { getHeader } from "../utils/getHeader";

const BUFFER_SIZE = 4 * 1024; // 4k

const decodeBuffer = (
  decoder: TextDecoder,
  u8: Uint8Array,
): [boolean, string] => {
  let str: string;
  try {
    str = decoder.decode(u8, {
      stream: true,
    });
  } catch (e) {
    return [false, ""];
  }

  return [true, str];
};

export const readRequest = async (
  request: Request,
  limit = Infinity,
): Promise<[boolean, string]> => {
  const contentLength = parseInt(
    getHeader(request, "content-length") || "0",
    10,
  ) || 0;

  if (contentLength > limit) {
    return [false, "Request content length exceeded"];
  }

  let result = "";
  const decoder = new TextDecoder("utf-8", {
    fatal: true,
    ignoreBOM: false,
  });

  // https://web.dev/streams/#the-getreader-and-read-methods-2
  const reader = request.body.getReader({
    mode: "byob",
  });

  let bytesReceived = 0;

  let buff = new ArrayBuffer(BUFFER_SIZE);

  for (;;) {
    const {
      done,
      value,
    } = await reader.readAtLeast(
      BUFFER_SIZE,
      new Uint8Array(buff, 0, BUFFER_SIZE),
    );

    const {
      byteLength,
    } = value;

    bytesReceived += byteLength;

    buff = value.buffer;

    if (bytesReceived > limit) {
      return [false, "Request body size exceeded"];
    }

    const [decodeSuccess, chunk] = decodeBuffer(decoder, value);

    if (!decodeSuccess) {
      return [false, "Invalid UTF8 input"];
    }

    result += chunk;

    if (done) {
      return [true, result];
    }
  }
};
