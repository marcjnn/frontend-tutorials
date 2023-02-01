// PubSub will loop through all subscribers and fire their callback
export default class PubSub {
  constructor() {
    // Where we store all our named events; we set it up to a blank object by defualt; where key will be an event name and value an array with all the callbacks
    this.events = {};
  }

  /**
   *
   * @param {*} event - string; the event’s unique name
   * @param {*} callback - function; called when the event happens
   * @returns the length of the events collection should someone needed to know how many events exist
   */
  subscribe(event, callback) {
    let self = this;

    //  If there’s not already a matching event in our events collection, we create it with a blank array so we don’t have to type check it later.
    if (!self.events.hasOwnProperty(event)) {
      self.events[event] = [];
    }

    // Array.prototype.push() returns the new length property of the object upon which the method was called
    return self.events[event].push(callback);
  }

  /**
   *
   * @param {*} event - string; the event’s unique name
   * @param {*} data - object that will be passed to the callback as payload
   * @returns an empty array when passed event doesn't exists in the collection or (?? not sure this part, see in action) we call every callback with the data as a payload
   */
  publish(event, data = {}) {
    let self = this;

    if (!self.events.hasOwnProperty(event)) {
      return [];
    }

    // for every callback we call it with the passed payload
    return self.events[event].map((callback) => callback(data));
  }
}
