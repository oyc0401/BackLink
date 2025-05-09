# Backlink

**Backlink** is a minimal, lightweight TypeScript library inspired by [Comlink](https://www.npmjs.com/package/comlink) for seamless communication from Web Workers back to the main thread.

Comlink primarily facilitates Main → Worker communication, while **Backlink** simplifies Worker → Main thread interactions, providing a clear and intuitive API.

## Key Features

* **Seamless Calls from Worker to Main:** Easily invoke main-thread methods directly from within your Web Worker.
* **Promise-based API:** All interactions are asynchronous and promise-based, simplifying your asynchronous workflow.
* **Automatic Transferable Handling:** Conveniently handle `Transferable` objects for high-performance data transfers.

## Installation

```bash
npm install backlink
```

## Usage

### Expose API on Main Thread

```ts
// main.ts
import { expose } from 'backlink';

const api = {
  logMessage(msg: string) {
    console.log(`Message from worker: ${msg}`);
  },
  getData() {
    return { data: "Hello from Main Thread" };
  }
};

const worker = new Worker('./worker.js');
expose(worker, api);
```

### Call API from Worker

```ts
// worker.ts
import { wrap } from 'backlink';

const main = wrap<typeof api>();

(async () => {
  await main.logMessage('Hi there!');
  const data = await main.getData();
  console.log(data); // { data: "Hello from Main Thread" }
})();
```

## Handling Transferables

Easily transfer objects efficiently between threads:

```ts
// worker.ts
import { wrap, transfer } from 'backlink';

const main = wrap<typeof api>();

const buffer = new ArrayBuffer(1024);
await main.receiveBuffer(transfer(buffer, [buffer]));
```

## License

MIT
