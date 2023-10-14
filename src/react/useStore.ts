import { Store } from "../createStore";
import useSyncExternalStoreExports from "use-sync-external-store/shim/with-selector";
const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports;

const useStore = <T, R = T>(
  store: Store<T>,
  selector: (state: T) => R = store.getState as any
) => {
  return useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getState,
    store.getState,
    selector
  );
};

export default useStore;
