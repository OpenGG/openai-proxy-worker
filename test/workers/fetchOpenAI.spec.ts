import { describe, expect, test } from "vitest";
import { useWorker } from "./helpers/worker.call.ts";
import { testVars } from "./helpers/worker.vars.ts";

describe("fetchOpenAI", () => {
  const worker = useWorker();
  test.concurrent("fetchOpenAI proxy", async () => {
    const chatInput = JSON.stringify({
      stream: true,
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `${Math.random()}`,
      }],
    });
    const res = await worker.chatCompletions({
      authorization: `KEY ${testVars.SECRET_AUTH_KEYS}`,
      "x-mock": "1",
    }, chatInput);

    expect(res).toMatchObject({
      status: 200,
      headers: {
        "x-mock-response": "1",
      },
      body: {
        headers: {
          authorization: `Bearer ${testVars.SECRET_OPENAI_API_KEY}`,
        },
        body: chatInput,
      },
    });
  });

  test.concurrent("fetchOpenAI passthrough", async () => {
    const chatInput = JSON.stringify({
      stream: true,
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `${Math.random()}`,
      }],
    });

    const passThroughKey = `Bearer ${Math.random()}`;

    const res = await worker.chatCompletions({
      authorization: passThroughKey,
      "x-mock": "1",
    }, chatInput);

    expect(res).toMatchObject({
      status: 200,
      headers: {
        "x-mock-response": "1",
      },
      body: {
        headers: {
          authorization: passThroughKey,
        },
        body: chatInput,
      },
    });
  });
});
