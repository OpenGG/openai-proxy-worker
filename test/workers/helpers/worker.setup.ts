import { WorkerPool } from "./worker.pool.ts";

const global = globalThis as any

global.workerPool = global.workerPool || new WorkerPool();
