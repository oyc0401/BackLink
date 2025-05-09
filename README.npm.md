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

## Install

```bash
npm install callink
```

## Example

**main.ts**
```ts
import { Callink } from "callink";

const obj = {
  counter: 0,
  inc() {
    this.counter++;
  },
};

const worker = new Worker("worker.js");
Callink.provide(worker, api);
```

**worker.ts**
```ts
import { Callink } from "callink";

async function init() {
  const main = Callink.connect();
  alert(`Counter: ${await main.counter}`);
  await main.inc();
  alert(`Counter: ${await main.counter}`);
}

init();
```

### Transferable

```ts
const data = new Uint8Array([1, 2, 3, 4, 5]);
await main.send(Callink.transfer(data, [data.buffer]));
```

### License

MIT License © 2025 [oyc0401](https://github.com/oyc0401)
