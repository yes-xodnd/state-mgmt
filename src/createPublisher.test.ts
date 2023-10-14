import createPublisher from "./createPublisher";

describe("publisher", () => {
  const publisher = createPublisher();
  const event = "EVENT";

  it("notifies event to its listeners", () => {
    const listener = jest.fn();
    publisher.subscribe(listener);
    publisher.notify(event);

    expect(listener).toBeCalled();
    expect(listener).toBeCalledWith(event);
  });

  it("removes listener when unsubscribed", () => {
    const listener = jest.fn();
    publisher.subscribe(listener);
    publisher.unsubscribe(listener);
    publisher.notify(event);

    expect(listener).not.toBeCalled();
  });
});
