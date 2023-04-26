import { describe, expect, test } from "vitest";
import { useWorker } from "./helpers/worker.call.ts";
import { testVars } from "./helpers/worker.vars.ts";

const largeJson = (size: number) => {
  const obj = {
    stream: true,
    model: "gpt-3.5-turbo",
    messages: [{
      role: "user",
      content: "",
    }],
  };

  const json = JSON.stringify(obj);
  const startLen = json.length;
  obj.messages[0].content = "1".repeat(size - startLen);

  return JSON.stringify(obj);
};

describe("readRequest content-length", () => {
  const worker = useWorker();

  test.concurrent("readRequest proxy content-length exceeded", async () => {
    const chatInput = largeJson(1 + (1 * 1024 * 1024));

    const res = await worker.chatCompletions({
      authorization: `KEY ${testVars.SECRET_AUTH_KEYS}`,
      "content-length": `${chatInput.length}`,
      "x-mock": "1",
    }, chatInput);

    expect(res).toMatchObject({
      status: 400,
      headers: {},
      body: {
        code: 400,
        message: "Request content length exceeded",
      },
    });
  });

  test.concurrent("fetchOpenAI passthrough", async () => {
    const chatInput = largeJson(1 + (1 * 1024 * 1024));

    const passThroughKey = `Bearer ${Math.random()}`;

    const res = await worker.chatCompletions({
      authorization: passThroughKey,
      "content-length": `${chatInput.length}`,
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

describe("readRequest Invalid UTF8 input", () => {
  const worker = useWorker();

  test.concurrent("readRequest proxy content-length exceeded", async () => {
    const chatInput = Buffer.from([0xff, 0xff, 0xff, 0xff]);

    const res = await worker.chatCompletions({
      authorization: `KEY ${testVars.SECRET_AUTH_KEYS}`,
      "x-mock": "1",
    }, chatInput);

    expect(res).toMatchObject({
      status: 400,
      headers: {},
      body: {
        code: 400,
        message: "Invalid UTF8 input",
      },
    });
  });

  test.concurrent("fetchOpenAI passthrough", async () => {
    const chatInput = Buffer.from([0xff, 0xff, 0xff, 0xff]);

    const passThroughKey = `Bearer ${Math.random()}`;

    const res = await worker.chatCompletions({
      authorization: passThroughKey,
      "content-length": `${chatInput.length}`,
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
        body: chatInput.toString(),
      },
    });
  });
});
