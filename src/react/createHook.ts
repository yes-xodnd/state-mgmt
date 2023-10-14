import { Store } from "../createStore";
import useStore from "./useStore";

const createHook = <T>(store: Store<T>) => {
  return <R>(selector?: (state: T) => R) => useStore(store, selector);
};

export default createHook;
