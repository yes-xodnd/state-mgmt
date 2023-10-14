import * as React from "react";
import { act, fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

import createStore from "../createStore";
import useStore from "./useStore";

describe("useStore", () => {
  it("creates a hook that returns store state", () => {
    const counterStore = createStore(0);

    const Counter = () => {
      const count = useStore(counterStore);
      return <div>count: {count}</div>;
    };

    const { getByText } = render(<Counter />);
    expect(getByText("count: 0")).toBeInTheDocument();
  });

  it("get selected value from store", async () => {
    const userStore = createStore({
      name: "john weak",
      age: 50,
    });

    const Username = () => {
      const name = useStore(userStore, (state) => state.name);
      return <div>name is {name}</div>;
    };

    const { findByText } = render(<Username />);
    const text = await findByText("name is john weak");

    expect(text).toBeInTheDocument();
  });

  it("updates UI on state change", async () => {
    const counterStore = createStore(0);

    const Counter = () => {
      const count = useStore(counterStore);

      return <div>count: {count}</div>;
    };

    const { findByText } = render(<Counter />);

    act(() => {
      counterStore.setState((state) => state + 1);
    });
    const text = await findByText("count: 1");

    expect(text).toBeInTheDocument();
  });

  it("updates UI on state change from DOM event", async () => {
    const counterStore = createStore(0);
    const increment = () => counterStore.setState((state) => state + 1);

    const Counter = () => {
      const count = useStore(counterStore);

      return (
        <div>
          <p>count: {count}</p>
          <button type="button" onClick={increment}>
            increment
          </button>
        </div>
      );
    };

    const { findByText } = render(<Counter />);
    const button = await findByText("increment");

    act(() => {
      fireEvent.click(button);
    });

    const text = await findByText("count: 1");
    expect(text).toBeInTheDocument();
  });

  it("does not trigger rerender on non-selected property update", async () => {
    const formStore = createStore({
      email: "",
      password: "",
    });

    const countEmailRender = jest.fn();
    const countPasswordRender = jest.fn();

    const EmailInput = () => {
      const value = useStore(formStore, (state) => state.email);

      React.useEffect(() => {
        countEmailRender();
      }, [value]);

      return (
        <label>
          email
          <input
            value={value}
            onChange={(e) =>
              formStore.setState(() => ({ email: e.target.value }))
            }
          />
        </label>
      );
    };

    const PasswordInput = () => {
      const value = useStore(formStore, (state) => state.password);

      React.useEffect(() => {
        countPasswordRender();
      }, [value]);

      return (
        <label>
          password
          <input
            value={value}
            onChange={(e) =>
              formStore.setState(() => ({ password: e.target.value }))
            }
          />
        </label>
      );
    };

    const { findByLabelText } = render(
      <div>
        <EmailInput />
        <PasswordInput />
      </div>
    );

    const password = await findByLabelText("password");

    act(() => {
      fireEvent.change(password, { target: { value: "a" } });
      fireEvent.change(password, { target: { value: "b" } });
    });

    expect(countPasswordRender).toBeCalledTimes(3);
    expect(countEmailRender).toBeCalledTimes(1);
  });
});
