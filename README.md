# Backlink

<p align="center">
  <a href="https://www.npmjs.com/package/backlink"><img alt="npm version" src="https://img.shields.io/npm/v/backlink.svg?style=flat-square"></a>
  <a href="https://github.com/oyc0401/backlink/actions"><img alt="CI status" src="https://img.shields.io/github/actions/workflow/status/oyc0401/backlink/ci.yml?branch=main&style=flat-square"></a>
  <a href="https://github.com/oyc0401/backlink/blob/main/LICENSE"><img alt="MIT license" src="https://img.shields.io/github/license/oyc0401/backlink.svg?style=flat-square"></a>
</p>

> **Backlink** – Seamless **Worker → Main** thread communication for TypeScript & JavaScript.
> Inspired by GoogleChromeLabs’ [Comlink](https://github.com/GoogleChromeLabs/comlink) (which focuses on **Main → Worker**), Backlink turns the arrow around.

---

## ✨ Features

* **Simple usage** – Call main-thread functions from workers as if they were local  
* **Built-in async support** – Works seamlessly with `async/await`  
* **Optimized data transfer** – Supports zero-copy transfer of `ArrayBuffer`, `MessagePort`, etc.  
* **Lightweight** – No external dependencies, minimal code footprint  


---

## 🚀 Quick Start

### 1. Install

```bash
npm install backlink
```

### 2. Expose Main‑thread API

```ts
// main.ts
import { Backlink } from "backlink";

const api = {
  log(message: string) {
    console.log(`[worker] ${message}`);
  },
  getTimestamp() {
    return Date.now();
  },
};

const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
Backlink.expose(worker, api);
```

### 3. Call from Worker

```ts
// worker.ts
import { Backlink } from "backlink";

const main = Backlink.wrap<typeof api>();

(async () => {
  await main.log("hello main ✨");
  const ts = await main.getTimestamp();
  
  console.log("timestamp from main:", ts);
})();
```

---

## 📦 Handling Transferables

```ts
// worker.ts
import { Backlink } from "backlink";

const main = Backlink.wrap<{ receive(buf: ArrayBuffer): void }>();

const buf = new ArrayBuffer(1024);
await main.receive(Backlink.transfer(buf, [buf])); // zero‑copy!
```

---

## 🛠 API Reference

| Function                                 | Description                                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `Backlink.wrap<T>()`                     | Create a proxy object inside **Worker** that mirrors the API type `T` located in the **Main** thread.  |
| `Backlink.expose(worker, api)`           | Expose a plain object `api` in **Main** so that a worker created with `worker` can invoke its members. |
| `Backlink.transfer(value, transferList)` | Helper to attach a `Transferable[]` to any argument or return value.                                   |

---

## 📝 Inspiration & Acknowledgements

Backlink owes its existence to **[Comlink](https://github.com/GoogleChromeLabs/comlink)**. While Comlink brilliantly streamlines **Main → Worker** RPC, Backlink covers the complementary direction (**Worker → Main**) with the same minimal mental overhead.

---

## 📄 License

MIT © 2025 oyc0401

---

## 한국어

> **Backlink** – 웹 워커에서 메인 스레드로의 통신을 손쉽게!
> GoogleChromeLabs의 [Comlink](https://github.com/GoogleChromeLabs/comlink)에서 영감을 받았으며, Comlink가 **메인 → 워커** 방향을 다루는 것과 달리 **워커 → 메인** 방향을 간단하게 처리합니다.

### ✨ 특징

* **간단한 사용법** – 워커 안에서 메인 스레드 함수를 직접 호출하듯 사용할 수 있습니다  
* **비동기 지원** – 모든 호출은 `async/await`으로 동작합니다  
* **전송 최적화 지원** – `ArrayBuffer`, `MessagePort` 등을 복사 없이 안전하게 전송할 수 있습니다  
* **가벼운 구성** – 의존성이 없고, 최소한의 코드만 포함되어 있습니다  


### 🚀 빠른 시작

#### 1. 설치

```bash
npm install backlink
```

#### 2. 메인 스레드 API 공개

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

#### 3. 워커에서 호출

```ts
// worker.ts
import { Backlink } from "backlink";

const main = Backlink.wrap<typeof api>();

(async () => {
  await main.log("안녕하세요, 메인!");
  const t = await main.now();
  
  console.log("메인 타임스탬프:", t);
})();
```

### 📦 Transferable 사용

```ts
import { Backlink } from "backlink";

const main = Backlink.wrap<{ recv(buf: ArrayBuffer): void }>();

const buf = new ArrayBuffer(2048);
await main.recv(Backlink.transfer(buf, [buf]));
```

### 라이선스

MIT © 2025 oyc0401
