# Callink

[![npm version](https://img.shields.io/npm/v/callink.svg)](https://www.npmjs.com/package/callink)
[![Build](https://github.com/oyc0401/Callink/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/oyc0401/Callink/actions/workflows/npm-publish.yml)
[![MIT license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/oyc0401/callink/blob/main/LICENSE)

> **Callink** is a TypeScript library inspired by [**Comlink**](https://github.com/GoogleChromeLabs/comlink),
> designed to simplify communication from Web Workers to the main thread.

### Features

* **Worker → Main** – If Comlink simplifies calling Workers from the main thread, `Callink` simplifies calling the main thread from Workers.
* **Simple usage** – Call main-thread functions directly from a Worker, just like local functions.
* **Transferable support** – Supports high-performance transfer of `ArrayBuffer`, `OffscreenCanvas`, and other transferable objects.

### Quick Start

#### 1. Installation

```bash
npm install callink
```

#### 2. Expose API on the Main Thread

```ts
// main.ts
import { Callink } from "callink";

const api = {
  log(msg: string) {
    console.log(`[worker] ${msg}`);
  },
  now() {
    return Date.now();
  },
};

const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
Callink.expose(worker, api);
```

#### 3. Call from the Worker

```ts
// worker.ts
import { Callink } from "callink";

const main = Callink.wrap<typeof api>();

(async () => {
  await main.log("Hello from the worker!");
  const t = await main.now();

  console.log("Timestamp from main thread:", t);
})();
```

### Using Transferables

```ts
import { Callink } from "callink";

const main = Callink.wrap<{ recv(buf: ArrayBuffer): void }>();

const buf = new ArrayBuffer(2048);
await main.recv(Callink.transfer(buf, [buf]));
```

### License

MIT License © 2025 [oyc0401](https://github.com/oyc0401)
