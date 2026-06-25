import assert from "node:assert/strict";
import { applyCommand, createState, feed, lessons, wanted } from "./src/app.js";

globalThis.localStorage = {
  getItem: () => "[]",
  setItem: () => {},
};

function runLesson(title) {
  const index = lessons.findIndex(lesson => lesson.title === title);
  assert.notEqual(index, -1);
  const state = createState(index);
  while (state.step < lessons[index].keys.length) {
    for (const key of wanted(state).match(/Ctrl\+[a-z]|Esc|./g)) feed(state, key);
  }
  assert.equal(state.message, "Lesson complete.");
}

runLesson("Moving by Words");
runLesson("Basic Movement");
runLesson("Intro to modes");
runLesson("Delete Words");
runLesson("Switch Selection Ends");

const state = createState(1);
applyCommand(state, "l");
assert.equal(state.col, 1);
applyCommand(state, "j");
assert.equal(state.row, 1);

console.log("ok");
