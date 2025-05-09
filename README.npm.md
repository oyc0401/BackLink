# Backlink

<p align="center">
  <a href="https://www.npmjs.com/package/backlink"><img alt="npm version" src="https://img.shields.io/npm/v/backlink.svg?style=flat-square"></a>
  <a href="https://github.com/oyc0401/backlink/actions"><img alt="CI status" src="https://img.shields.io/github/actions/workflow/status/oyc0401/backlink/ci.yml?branch=main&style=flat-square"></a>
  <a href="https://github.com/oyc0401/backlink/blob/main/LICENSE"><img alt="MIT license" src="https://img.shields.io/github/license/oyc0401/backlink.svg?style=flat-square"></a>
</p>

> **Backlink** is a TypeScript library inspired by [**Comlink**](https://github.com/GoogleChromeLabs/comlink), 
> designed to simplify communication from Web Workers to the main thread.

### Features

* **Worker → Main** – If Comlink simplifies calling Workers from the main thread, `Backlink` simplifies calling the main thread from Workers.
* **Simple usage** – Call main-thread functions directly from a Worker, just like local functions.
* **Transferable support** – Supports high-performance transfer of `ArrayBuffer`, `OffscreenCanvas`, and other transferable objects.


### Quick Start

#### 1. Installation

```bash
npm install backlink
```

#### 2. Expose API on the Main Thread

```ts
// main.ts
import { Backlink } from "backlink";

const api = {
  log(msg: string) {
    console.log(`[worker] ${msg}`);
  },
  now() {
    return Date.now();
  },
};

const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
Backlink.expose(worker, api);
```

#### 3. Call from the Worker

```ts
// worker.ts
import { Backlink } from "backlink";

const main = Backlink.wrap<typeof api>();

(async () => {
  await main.log("Hello from the worker!");
  const t = await main.now();

  console.log("Timestamp from main thread:", t);
})();
```

### Using Transferables

```ts
import { Backlink } from "backlink";

const main = Backlink.wrap<{ recv(buf: ArrayBuffer): void }>();

const buf = new ArrayBuffer(2048);
await main.recv(Backlink.transfer(buf, [buf]));
```

### License

MIT License © 2025 [oyc0401](https://github.com/oyc0401)
