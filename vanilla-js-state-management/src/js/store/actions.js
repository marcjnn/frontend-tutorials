export default {
  // The context is the instance of the Store class and the payload is passed in by whatever dispatches the action
  addItem(context, payload) {
    context.commit("addItem", payload);
  },
  clearItem(context, payload) {
    context.commit("clearItem", payload);
  },
};
