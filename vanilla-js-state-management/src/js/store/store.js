import PubSub from "../lib/pubsub.js";

export default class Store {
  constructor(params) {
    let self = this;

    self.actions = {};
    self.mutations = {};
    self.state = {};

    self.status = "resting";

    self.events = new PubSub();

    if (params.hasOwnProperty("actions")) {
      self.actions = params.actions;
    }

    if (params.hasOwnProperty("mutations")) {
      self.mutations = params.mutations;
    }

    self.state = new Proxy(params.state || {}, {
      // we’re trapping the state object set operations. That means that when a mutation runs something like state.name = 'Foo', this trap catches it before it can be set and provides us an opportunity to work with the change or even reject it completely.
      set: function (state, key, value) {
        // we’re setting the change and then logging it to the console
        state[key] = value;

        console.log(`stateChange: ${key}: ${value}`);

        // We’re then publishing a stateChange event with our PubSub module
        self.events.publish("stateChange", self.state);

        if (self.status !== "mutation") {
          console.warn(`You should use a mutation to set ${key}`);
        }

        self.status = "resting";

        return true;
      },
    });
  }

  // actions -> dispatch
  dispatch(actionKey, payload) {
    let self = this;

    if (typeof self.actions[actionKey] !== "function") {
      console.error(`Action "${actionKey} doesn't exist.`);
      return false;
    }

    console.groupCollapsed(`ACTION: ${actionKey}`);

    self.status = "action";

    self.actions[actionKey](self, payload);

    console.groupEnd();

    return true;
  }

  // mutations -> commit
  commit(mutationKey, payload) {
    let self = this;

    // If the mutation can be found, we run it and get our new state from its return value. We then take that new state and merge it with our existing state to create an up-to-date version of our state
    if (typeof self.mutations[mutationKey] !== "function") {
      console.log(`Mutation "${mutationKey}" doesn't exist`);
      return false;
    }

    self.status = "mutation";

    let newState = self.mutations[mutationKey](self.state, payload);

    self.state = Object.assign(self.state, newState);

    return true;
  }
}
