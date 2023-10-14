# state mgmt

pubsub 패턴과 리액트 useSyncExternalStore API를 이용해 만들어본 리액트 상태관리 도구입니다.
zustand를 참고하여 유사한 인터페이스를 가지고 있습니다.

- `store`는 상태를 관리하는 역할만 수행하고, 상태를 수정하는 `action`은 스토어 외부에 자유롭게 선언하여 사용할 수 있습니다.
- `persist` 미들웨어를 제공합니다.
- 클라이언트 사이드에서의 동작만을 보장합니다.

## example

```tsx
// counterStore.ts
import { createStore, createHook, persist } from 'state-mgmt';

const initialState = {
  count: 0,
};

export const counterStore = persist(
  createStore(initialState),
  'store/counter',
  sessionStorage
);

export const counterActions = {
  increment: () => counterStore.setState(state => state + 1),
  decrement: () => counterStore.setState(state => state - 1),
  clear: () => counterStore.setState(initialState),
}

export useCounterStore = createHook(counterStore);

// Counter.tsx
import { useCounterStore, counterActions } from './CounterStore.ts';

const Counter = () => {
  const count = useCounterStore();

  return (
    <div>
      <p>count: { count }</p>
      <button onClick={increment}>increment</button>
      <button onClick={decrement}>decrement</button>
    </div>
  )
}
```
