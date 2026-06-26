import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { checkGoal, createRun, currentGoal, demoSteps, demoTokens, insertionPoint, lessons, normalizeVimKey, placementText, recordKey, runStats, toVimKey, visibleText } from "./src/app.js";

globalThis.localStorage = {
  getItem: () => "[]",
  setItem: () => {},
};

function lessonIndex(title) {
  const index = lessons.findIndex(lesson => lesson.title === title);
  assert.notEqual(index, -1);
  return index;
}

const movement = createRun(lessonIndex("Basic Movement"));
for (const goal of lessons[movement.lessonIndex].goals) {
  recordKey(movement, "l", 1000);
  assert.equal(checkGoal(movement, { cursor: goal.at, text: goal.sample, mode: "NORMAL" }, 2000), true);
}
assert.equal(movement.completedAt, 2000);

const wrong = createRun(lessonIndex("Basic Movement"));
recordKey(wrong, "x", 1000);
recordKey(wrong, "h", 1100);
assert.equal(wrong.startedAt, 1100);
assert.equal(runStats(wrong, 2100).accuracy, 50);

const words = createRun(lessonIndex("Moving by Words"));
const firstWordGoal = currentGoal(words);
recordKey(words, "w", 1000);
assert.equal(checkGoal(words, { cursor: firstWordGoal.at, text: firstWordGoal.sample, mode: "NORMAL" }, 1500), true);

assert.equal(normalizeVimKey("<C-D>"), "Ctrl+d");
assert.equal(toVimKey("Ctrl+d"), "<C-d>");

const insertLesson = lessons[lessonIndex("Insert Mode")];
assert.deepEqual(demoTokens(insertLesson).slice(0, 6), ["i", "n", "e", "w", " ", "Esc"]);
assert.equal(demoSteps(insertLesson)[1].pace < demoSteps(insertLesson)[0].pace, true);
assert.deepEqual(insertionPoint(insertLesson.goals[0]), insertLesson.goals[0].range.from);
assert.equal(placementText(insertLesson.goals[0]), "before \"guest\"");
assert.equal(placementText(lessons[lessonIndex("Making Small Edits")].goals[0]), "");
assert.equal(visibleText("  teal"), "[space][space]teal");
assert.equal(visibleText("new "), "new[space]");

const scenarioHtml = readFileSync(new URL("./specs/scenarios.html", import.meta.url), "utf8");
assert.equal((scenarioHtml.match(/<td>\d+<\/td>/g) || []).length, lessons.reduce((total, lesson) => total + lesson.goals.length, 0));
for (const lesson of lessons) assert.ok(scenarioHtml.includes(`<summary><span>${lesson.title}</span><span class="count">${lesson.goals.length} challenges</span></summary>`));

console.log("ok");
