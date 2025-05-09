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

### 빠른 시작

#### 1. 설치

```bash
npm install callink
```

#### 2. 메인 스레드 API 공개

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

#### 3. 워커에서 호출

```ts
// worker.ts
import { Callink } from "callink";

const main = Callink.wrap<typeof api>();

(async () => {
  await main.log("안녕하세요, 메인!");
  const t = await main.now();
  
  console.log("메인 타임스탬프:", t);
})();
```

### Transferable 사용

```ts
import { Callink } from "callink";

const main = Callink.wrap<{ recv(buf: ArrayBuffer): void }>();

const buf = new ArrayBuffer(2048);
await main.recv(Callink.transfer(buf, [buf]));
```

### 라이선스

MIT License © 2025 [oyc0401](https://github.com/oyc0401)
