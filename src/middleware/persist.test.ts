import createStore from "../createStore";
import persist from "./persist";

const createMockStorage = () => {
  const map = new Map<string, string>();
  return {
    setItem: (key: string, value: string) => map.set(key, value),
    getItem: (key: string) => map.get(key) || null,
    clear: () => map.clear(),
  };
};

describe("persist", () => {
  const mockStorage = createMockStorage();
  const key = "key";

  afterEach(() => {
    mockStorage.clear();
  });

  it("restores persisted state", () => {
    mockStorage.setItem(key, JSON.stringify("best"));
    const store = persist(createStore("good"), key, mockStorage);

    expect(store.getState()).toBe("best");
  });

  it("restores persisted state without clearing optional property", () => {
    const prevState = { name: "parker" };
    const currentState = { name: "", age: 100 };

    mockStorage.setItem(key, JSON.stringify(prevState));
    const store = persist(createStore(currentState), key, mockStorage);

    expect(store.getState()).toEqual({ name: "parker", age: 100 });
  });

  it("stores its state on create", () => {
    const store = persist(createStore("good"), key, mockStorage);
    expect(JSON.parse(mockStorage.getItem(key) || "")).toBe(store.getState());
  });

  it("stores its state on state change", () => {
    const store = persist(createStore("good"), key, mockStorage);
    store.setState("better");

    expect(JSON.parse(mockStorage.getItem(key) || "")).toBe(store.getState());
  });
});
