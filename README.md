# Callink

[![npm version](https://img.shields.io/npm/v/callink.svg)](https://www.npmjs.com/package/callink)
[![Build](https://github.com/oyc0401/Callink/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/oyc0401/Callink/actions/workflows/npm-publish.yml)
[![MIT license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/oyc0401/callink/blob/main/LICENSE)

> **Callink** 는 [**Comlink**](https://github.com/GoogleChromeLabs/comlink)에서 영감을 받아 개발한 TypeScript 라이브러리로,
> 웹 워커에서 메인 스레드로의 통신을 간편하게 만들어줍니다.

### 특징

* **웹워커 -> 메인** - Comlink가 메인에서 워커로의 호출을 간소화했다면, `Callink`는 워커에서 메인으로의 호출을 간소화합니다.
* **간단한 사용법** – 워커 안에서 메인 스레드 함수를 직접 호출하듯 사용할 수 있습니다
* **전송 최적화 지원** – `ArrayBuffer`, `OffscreenCanvas` 등을 전송하는 Transferable을 지원합니다.

## 설치

```bash
npm install callink
```

## 예시

**main.ts**
```ts
import { Callink } from "callink";

const obj = {
  counter: 0,
  inc() {
    return this.counter++;
  },
};

const worker = new Worker("worker.js");
Callink.provide(worker, api);
```

**worker.ts**
```ts
import { Callink } from "callink";

const main = Callink.connect();

async function init() {;
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

### 라이선스

MIT License © 2025 [oyc0401](https://github.com/oyc0401)
