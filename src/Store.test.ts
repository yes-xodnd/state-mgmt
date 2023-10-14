import Store from "./Store";

describe("store", () => {
  it("gets state", () => {
    const initialState = 0;
    const store = new Store(initialState);

    expect(store.getState()).toBe(initialState);
  });

  it("sets state with value", () => {
    const initialState = 0;
    const nextState = 1;
    const store = new Store(initialState);

    store.setState(nextState);

    expect(store.getState()).toBe(nextState);
  });

  it("sets non-object state with updater", () => {
    const initialState = 0;
    const store = new Store(initialState);

    store.setState((state) => state + 1);

    expect(store.getState()).toBe(1);
  });

  it("sets object state with partial updater", () => {
    const initialState = {
      name: "john",
      age: 0,
    };
    const partialState: Partial<typeof initialState> = {
      age: 1,
    };
    const store = new Store(initialState);
    store.setState(() => partialState);

    expect(store.getState()).toMatchObject({
      name: "john",
      age: 1,
    });
  });

  it("notifies state change to listeners", () => {
    const store = new Store(0);
    const listener = jest.fn();

    store.subscribe(listener);
    store.setState(1);

    expect(listener).toBeCalled();
  });

  it("does not notify when next state is equal to previous state", () => {
    const store = new Store(0);
    const listener = jest.fn();

    store.subscribe(listener);
    store.setState(0);

    expect(listener).not.toBeCalled();
  });

  it("does not notify to unsubscribed listener", () => {
    const store = new Store(0);
    const listener = jest.fn();
    const unsubscribe = store.subscribe(listener);

    unsubscribe();
    store.setState(1);

    expect(listener).not.toBeCalled();
  });
});
