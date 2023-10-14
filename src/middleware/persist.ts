import { Store } from "../createStore";

type JsonStorage = {
  setItem: (key: string, value: string) => void;
  getItem: (key: string) => string | null;
};

const createPersister = <T>(key: string, storage: JsonStorage) => {
  const save = (value: T) => {
    storage.setItem(key, JSON.stringify(value));
  };

  const restore = (): T | null => {
    const persisted = storage.getItem(key);
    return persisted ? JSON.parse(persisted) : null;
  };

  return {
    save,
    restore,
  };
};

const persist = <T>(
  store: Store<T>,
  key: string,
  storage: JsonStorage = sessionStorage
): Store<T> => {
  const persister = createPersister<T>(key, storage);
  const persisted = persister.restore();

  if (persisted) {
    store.setState(() => persisted);
  }

  store.subscribe(persister.save);
  persister.save(store.getState());

  return store;
};

export default persist;
