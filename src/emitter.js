import mitt from "mitt";

const emitter = mitt();
export default emitter;

// Personally I dislike default exports/imports as they can make traversing the codebase more difficult
// Using named exports makes for beter consistency imo
// export const emitter = mitt()
