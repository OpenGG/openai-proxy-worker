import { describe, expect, test } from "vitest";
import { useWorker } from "./helpers/worker.call.ts";
import { testVars } from "./helpers/worker.vars.ts";

describe("jsonFilter", () => {
  const worker = useWorker();

  test.concurrent("jsonFilter proxy", async () => {
    const chatInput = JSON.stringify({
      stream: true,
      model: "unknown-model",
      messages: [{
        role: "user",
        content: `${Math.random()}`,
      }],
    });
    const res = await worker.chatCompletions({
      authorization: `KEY ${testVars.SECRET_AUTH_KEYS}`,
      "x-mock": "1",
    }, chatInput.slice(0, -1));

    expect(res).toMatchObject({
      status: 400,
      headers: {
        "content-type": "application/json",
      },
      body: {
        code: 400,
        message: "Invalid json input",
      },
    });
  });

  test.concurrent("jsonFilter passthrough", async () => {
    const chatInput = JSON.stringify({
      stream: true,
      model: "unknown-model",
      messages: [{
        role: "user",
        content: `${Math.random()}`,
      }],
    });

    const passThroughKey = `Bearer ${Math.random()}`;

    const res = await worker.chatCompletions({
      authorization: passThroughKey,
      "x-mock": "1",
    }, chatInput.slice(0, -1));

    expect(res).toMatchObject({
      status: 200,
      headers: {
        "content-type": "application/json",
        "x-mock-response": "1",
      },
      body: {
        headers: {
          authorization: passThroughKey,
        },
        body: chatInput.slice(0, -1),
      },
    });

    expect(() => JSON.parse(res.body.body)).toThrow();
  });
});
