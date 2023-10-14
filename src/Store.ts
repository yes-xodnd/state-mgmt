import Publisher from "./Publisher";

type Updater<T> = (state: T) => Partial<T>;

export default class Store<T> {
  private state: T;
  private publisher = new Publisher<T>();

  constructor(initialState: T) {
    this.state = initialState;
  }

  private isUpdater(value: T | Updater<T>): value is Updater<T> {
    return typeof value === "function";
  }

  private getNextState(value: T | Updater<T>): T {
    if (!this.isUpdater(value)) {
      return value;
    }

    const partialState = value(this.state);
    return typeof partialState === "object"
      ? { ...this.state, ...partialState }
      : partialState;
  }

  setState(value: T | Updater<T>) {
    const nextState = this.getNextState(value);

    if (Object.is(this.state, nextState)) {
      return;
    }

    this.state = nextState;
    this.publisher.notify(nextState);
  }

  getState() {
    return this.state;
  }

  subscribe(listener: (state: T) => void) {
    this.publisher.subscribe(listener);
    return () => this.publisher.unsubscribe(listener);
  }
}
