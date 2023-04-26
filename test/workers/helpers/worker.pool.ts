import { unstable_dev, UnstableDevWorker } from "wrangler";
import { testVars } from "./worker.vars.ts";

type TestWorker = UnstableDevWorker;

export class WorkerPool {
  private worker: TestWorker | Promise<TestWorker> | undefined;

  private using = 0;

  private async createWorker() {
    const worker = await unstable_dev("src/index.ts", {
      local: true,
      logLevel: "debug",
      vars: testVars,
    });

    console.log("worker started on: http://%s:%d", worker.address, worker.port);

    this.worker = worker;

    return worker;
  }

  private stopWorker() {
    const { worker } = this;

    if (!worker) {
      return;
    }

    const promise = (
        worker as Promise<TestWorker>
      ).then
      ? worker as Promise<TestWorker>
      : null;

    if (promise) {
      promise.then((w) => {
        if (this.using > 0) {
          return;
        }
        this.worker = undefined;
        w.stop();
      });
      return;
    }

    this.worker = undefined;
    (worker as TestWorker).stop();
  }

  getWorker() {
    this.using += 1;

    if (!this.worker) {
      this.worker = this.createWorker();
    }

    return this.worker;
  }

  releaseWorker() {
    this.using -= 1;

    if (this.using > 0) {
      return;
    }

    this.stopWorker();
  }
}
