import createPublisher from "./createPublisher";

type Updater<T> = (state: T) => Partial<T>;

export type Store<T> = {
  subscribe: (listener: (state: T) => void) => () => void;
  getState: () => T;
  setState: (value: Partial<T> | Updater<T>) => void;
};

const createStore = <T>(initialState: T): Store<T> => {
  const publisher = createPublisher<T>();
  let state = initialState;

  const subscribe = (listener: (state: T) => void) => {
    publisher.subscribe(listener);
    return () => publisher.unsubscribe(listener);
  };

  const isUpdater = (value: Partial<T> | Updater<T>): value is Updater<T> => {
    return typeof value === "function";
  };

  const getNextState = (value: Partial<T> | Updater<T>): T => {
    const partialState = isUpdater(value) ? value(state) : value;
    return typeof partialState === "object"
      ? { ...state, ...partialState }
      : partialState;
  };

  const setState = (value: Partial<T> | Updater<T>) => {
    const nextState = getNextState(value);

    if (Object.is(state, nextState)) {
      return;
    }

    state = nextState;
    publisher.notify(nextState);
  };

  const getState = () => state;

  return {
    subscribe,
    getState,
    setState,
  };
};

export default createStore;
