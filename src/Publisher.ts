type Listener<T> = (event: T) => void;

export default class Publisher<T> {
  private listeners = new Set<Listener<T>>();

  subscribe(listener: Listener<T>) {
    this.listeners.add(listener);
  }

  unsubscribe(listener: Listener<T>) {
    this.listeners.delete(listener);
  }

  notify(event: T) {
    this.listeners.forEach((listener) => listener(event));
  }
}
