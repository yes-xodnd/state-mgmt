type Publisher<T> = {
  subscribe: (listener: Listener<T>) => void;
  unsubscribe: (listener: Listener<T>) => void;
  notify: (event: T) => void;
};

type Listener<T> = (event: T) => void;

const createPublisher = <T>(): Publisher<T> => {
  const listeners = new Set<Listener<T>>();

  const subscribe = (listener: Listener<T>) => {
    listeners.add(listener);
  };

  const unsubscribe = (listener: Listener<T>) => {
    listeners.delete(listener);
  };

  const notify = (event: T) => {
    listeners.forEach((listener) => listener(event));
  };

  return {
    subscribe,
    unsubscribe,
    notify,
  };
};

export default createPublisher;
