# Backlink

<p align="center">
  <a href="https://www.npmjs.com/package/backlink"><img alt="npm version" src="https://img.shields.io/npm/v/backlink.svg?style=flat-square"></a>
  <a href="https://github.com/oyc0401/backlink/actions"><img alt="CI status" src="https://img.shields.io/github/actions/workflow/status/oyc0401/backlink/ci.yml?branch=main&style=flat-square"></a>
  <a href="https://github.com/oyc0401/backlink/blob/main/LICENSE"><img alt="MIT license" src="https://img.shields.io/github/license/oyc0401/backlink.svg?style=flat-square"></a>
</p>

> **Backlink** 는 [**Comlink**](https://github.com/GoogleChromeLabs/comlink)에서 영감을 받아 개발한
> 웹 워커에서 메인 스레드로의 통신을 간편하게 만들어주는 TypeScript 라이브러리입니다.

### 특징

* **웹워커 -> 메인** - Comlink가 메인에서 워커로의 호출을 간소화했다면, `Backlink`는 워커에서 메인으로의 호출을 간소화합니다.
* **간단한 사용법** – 워커 안에서 메인 스레드 함수를 직접 호출하듯 사용할 수 있습니다  
* **전송 최적화 지원** – `ArrayBuffer`, `OffscreenCanvas` 등을 전송하는 Transferable을 지원합니다. 


### 빠른 시작

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

### Transferable 사용

```ts
import { Backlink } from "backlink";

const main = Backlink.wrap<{ recv(buf: ArrayBuffer): void }>();

const buf = new ArrayBuffer(2048);
await main.recv(Backlink.transfer(buf, [buf]));
```

### 라이선스

MIT License © 2025 [oyc0401](https://github.com/oyc0401)
