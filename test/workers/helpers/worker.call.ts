import { beforeAll } from "vitest";
import type { WorkerPool } from "./worker.pool.ts";

export const useWorker = () => {
  const global = globalThis as any;
  const workerPool: WorkerPool = global.workerPool;

  beforeAll(() => {
    workerPool.getWorker();

    return () => {
      workerPool.releaseWorker();
    };
  });

  const call = async (path: string, options?: {
    method: string;
    headers?: Record<string, string>;
    body?: string | ArrayBuffer | DataView;
  }) => {
    const w = await workerPool.getWorker();
    const url = `http://a${path}`;

    return w.fetch(url, {
      method: options?.method,
      headers: {
        "content-type": "application/json",
        ...options?.headers,
      },
      body: options?.body,
    });
  };

  const chatCompletions = async (
    headers: Record<string, string>,
    body: string | ArrayBuffer | DataView | Record<string, unknown>,
  ) => {
    const bodyType = Object.prototype.toString.call(body).replace(
      /^\[object |\]$/,
      "",
    );

    const bodyValue = bodyType === "object"
      ? JSON.stringify(body)
      : bodyType === "String"
      ? body as string
      : body as Uint8Array;

    const res = await call("/v1/chat/completions", {
      method: "post",
      headers: {
        ...headers,
        "x-mock": "1",
      },
      body: bodyValue,
    });

    const resHeaders: Record<string, string> = {};
    res.headers.forEach((v, k) => {
      resHeaders[k] = v;
    });

    return {
      status: res.status,
      headers: resHeaders,
      body: await res.json() as {
        status: number;
        url: string;
        method: string;
        headers: Record<string, string>;
        body: string;
      },
    };
  };

  return {
    call,
    chatCompletions,
  };
};
