import assert from "node:assert/strict";
import { createState, demoTokens, lessons, normalizeVimKey, tokens, toVimKey, track, wanted } from "./src/app.js";

globalThis.localStorage = {
  getItem: () => "[]",
  setItem: () => {},
};

function runLesson(title) {
  const index = lessons.findIndex(lesson => lesson.title === title);
  assert.notEqual(index, -1);
  const state = createState(index);
  while (state.step < lessons[index].keys.length) {
    for (const key of tokens(wanted(state))) track(state, key);
  }
  assert.equal(state.message, "Lesson complete.");
}

runLesson("Moving by Words");
runLesson("Basic Movement");
runLesson("Intro to modes");
runLesson("Delete Words");
runLesson("Switch Selection Ends");

const state = createState(1);
track(state, "x");
assert.equal(state.step, 0);
track(state, "h");
assert.equal(state.step, 1);
assert.equal(normalizeVimKey("<C-D>"), "Ctrl+d");
assert.equal(toVimKey("Ctrl+d"), "<C-d>");
assert.deepEqual(demoTokens(lessons.find(lesson => lesson.title === "Intro to modes")), ["i", "d", "e", "m", "o", "Esc"]);

console.log("ok");
