// First up, we’re importing the Store class. This isn’t because we want an instance of it, but more for checking one of our properties in the constructor
import Store from "../store/store.js";

export default class Component {
  constructor(props = {}) {
    let self = this;

    //  we’re looking to see if we’ve got a render method. If this Component class is the parent of another class, then that will have likely set its own method for render. If there is no method set, we create an empty method that will prevent things from breaking.
    this.render = this.render || function () {};

    //  We do this to make sure that the store prop is a Store class instance so we can confidently use its methods and properties.
    if (props.store instanceof Store) {
      // we’re subscribing to the global stateChange event so our object can react. This is calling the render function each time the state changes.
      props.store.events.subscribe("stateChange", () => self.render());
    }

    if (props.hasOwnProperty("element")) {
      this.element = props.element;
    }
  }
}
