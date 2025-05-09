const TRANSFER = Symbol("callink.transfer");

declare const self: DedicatedWorkerGlobalScope;

type WithTransfer<T> = T & { [TRANSFER]?: Transferable[] };

/** 인자에 붙일 Transferable 헬퍼 */
export function transfer<T>(value: T, list: Transferable[]): WithTransfer<T> {
  (value as WithTransfer<T>)[TRANSFER] = list;
  return value as WithTransfer<T>;
}

///////////////////////
// Proxy → Worker 호출
///////////////////////
export function wrap<T extends Record<string, any>>() {
  /* ---------- (1) 요청-응답 ID 테이블 ---------- */
  let seq = 0; // 메시지 ID
  const pending = new Map<number, (v: any) => void>();

  /* ---------- (1-b) 워커가 보낸 ‘RET’ 처리 ---------- */
  self.addEventListener("message", (e) => {
    const { type, id, value } = e.data || {};
    if (type === "RET" && pending.has(id)) {
      pending.get(id)!(value);
      pending.delete(id);
    }
  });

  type Proxyified<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => infer R // 함수라면
      ? (
          // → Promise<R>
          ...args: [...Parameters<T[K]>, Transferable[]?]
        ) => Promise<Awaited<R>>
      : Promise<T[K]>; // 값이라면 Promise
  };

  function build(propKey: string): any {
    /* 메서드 호출 & 프로퍼티 읽기를 모두 처리하는 이중 프록시 */
    return new Proxy(
      () => {}, // 빈 함수(메서드 호출용 apply 트랩)
      {
        /* (a) 함수처럼 호출될 때 → CALL  */
        apply: (_t, _this, rawArgs: any[]) => {
          let transfer: Transferable[] = [];
          if (Array.isArray(rawArgs[rawArgs.length - 1])) {
            transfer = rawArgs.pop();
          }
          const args = rawArgs.map((v: any) => {
            if (v && v[TRANSFER]) {
              transfer.push(...v[TRANSFER]);
              delete v[TRANSFER];
            }
            return v;
          });
          const id = seq++;
          const p = new Promise((res) => pending.set(id, res));
          self.postMessage({ type: "CALL", id, prop: propKey, args }, transfer);

          return p;
        },

        /* (b) `.then` 접근될 때 → 프로퍼티 읽기 Promise 반환 */
        get: (_t, sub) => {
          if (sub === "then") {
            const id = seq++;
            const p = new Promise((resolve) => pending.set(id, resolve));
            self.postMessage({ type: "GET", prop: propKey, id });
            // `await proxy`가 먹히려면 `then`을 함수로 돌려줘야 한다
            return p.then.bind(p);
          }
          /* 체이닝 지원을 위해 또 다른 Proxy 생성 */
          return build(`${propKey}.${String(sub)}`);
        },
      },
    );
  }

  /* ---------- (3) 최상위 API 프록시 ---------- */
  return new Proxy({} as Proxyified<T>, {
    get: (_t, prop: string) => build(prop),
  });
}

export function expose<T extends Record<string, any>>(worker: Worker, api: T) {
  worker.onmessage = ({ data }) => {
    const { type, prop, args, id } = data;

    if (type === "CALL") {
      const result = (api as any)[prop]?.(...(args || []));
      /* Promise 반환 함수면 완료까지 await */
      Promise.resolve(result).then((value) =>
        worker.postMessage({ type: "RET", id, value }),
      );
    } else if (type === "GET") {
      const value = prop.split(".").reduce((o: any, k: string) => o?.[k], api);
      worker.postMessage({ type: "RET", id, value });
    }
  };
}

export const Callink = { wrap, expose, transfer } as const;
