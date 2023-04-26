import { describe, expect, test } from "vitest";
import { useWorker } from "./helpers/worker.call.ts";

describe("router", () => {
  const worker = useWorker()
  test.concurrent("GET /404 is not found", async () => {
    const response = await worker.call("/404");

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      code: 404,
      message: "Not Found",
    });
  });
});
