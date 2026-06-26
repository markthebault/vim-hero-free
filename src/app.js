const codeSample = `// Move through this code with Vim motions.
function setGreeting(greeting) {
  const element = document.getElementById("greeting");
  element.innerText = greeting;
}

setGreeting("Hello World");`;

const wordSample = `function setGreeting(greeting) {
  const element = document.getElementById("greeting");
  element.innerText = greeting;
}

setGreeting("Hello World");`;

const editSample = `const username = "guest";
const status = "draft";
const count = 3;

render(username, status, count);`;

const bracketSample = `const config = {
  user: "guest",
  roles: ["reader", "editor"],
  theme: { color: "green" }
};

writeReport("draft paragraph", config);`;

const paragraphSample = `first paragraph line one
first paragraph line two

second paragraph line one
second paragraph line two

third paragraph line one
third paragraph line two`;

const openSample = `settings:
  retries: 3

services:
  api: enabled

alerts:
  email: true`;

const visualSample = `const alpha = "ready";
const beta = "draft";
const gamma = "done";`;

function lesson(title, commands, options = {}) {
  return {
    title,
    commands,
    sample: options.sample || codeSample,
    goals: options.goals || makeCursorGoals(codeSample),
    demo: options.demo || commands.slice(0, 3),
    summary: options.summary || "Reach each highlighted goal using this lesson's Vim commands.",
  };
}

function p(line, ch) {
  return { line, ch };
}

function cursorGoal(start, at, hint, sample = codeSample, allowed) {
  return { type: "cursor", sample, start, at, hint, allowed };
}

function modeGoal(start, mode, hint, sample = editSample, allowed) {
  return { type: "mode", sample, start, mode, hint, allowed };
}

function documentGoal(start, checks, hint, sample = editSample, allowed) {
  return { type: "document", sample, start, hint, allowed, ...checks };
}

function text(value, target = "insert") {
  return { text: value, target };
}

function makeCursorGoals(sample) {
  return [
    cursorGoal(p(0, 0), p(0, 8), "Move right to the target.", sample),
    cursorGoal(p(0, 8), p(0, 2), "Move left to the target.", sample),
    cursorGoal(p(0, 2), p(3, 2), "Move down to the target.", sample),
    cursorGoal(p(3, 2), p(1, 2), "Move up to the target.", sample),
    cursorGoal(p(1, 11), p(1, 22), "Cross the function name.", sample),
    cursorGoal(p(2, 4), p(2, 16), "Reach the variable name.", sample),
    cursorGoal(p(2, 16), p(2, 8), "Go back across the line.", sample),
    cursorGoal(p(2, 8), p(4, 0), "Drop to the closing brace.", sample),
    cursorGoal(p(4, 0), p(1, 0), "Climb back to the function.", sample),
    cursorGoal(p(6, 0), p(6, 20), "Move to the call argument.", sample),
    cursorGoal(p(6, 20), p(6, 5), "Move back before the call.", sample),
    cursorGoal(p(1, 0), p(2, 0), "Move down one line.", sample),
    cursorGoal(p(2, 0), p(3, 0), "Move down again.", sample),
    cursorGoal(p(3, 0), p(2, 0), "Move up one line.", sample),
    cursorGoal(p(2, 0), p(2, 24), "Finish on the highlighted code.", sample),
  ];
}

function wordGoals() {
  const start = pos(wordSample, "const");
  return [
    cursorGoal(start, pos(wordSample, "element"), "Jump to the next word.", wordSample),
    cursorGoal(start, pos(wordSample, "document"), "Jump to the object name.", wordSample),
    cursorGoal(pos(wordSample, "document"), pos(wordSample, "getElementById"), "Move to the method name.", wordSample),
    cursorGoal(pos(wordSample, "getElementById"), pos(wordSample, "greeting", 1), "Reach the quoted word.", wordSample),
    cursorGoal(pos(wordSample, "greeting", 1), pos(wordSample, "getElementById"), "Move back to the method.", wordSample),
    cursorGoal(pos(wordSample, "element", 1), pos(wordSample, "innerText"), "Jump to the property.", wordSample),
    cursorGoal(pos(wordSample, "innerText"), pos(wordSample, "greeting", 2), "Move to the assigned word.", wordSample),
    cursorGoal(pos(wordSample, "greeting", 2), pos(wordSample, "innerText"), "Move back one word.", wordSample),
    cursorGoal(pos(wordSample, "setGreeting", 1), pos(wordSample, "Hello"), "Reach the first argument word.", wordSample),
    cursorGoal(pos(wordSample, "Hello"), pos(wordSample, "World"), "Move to the next word.", wordSample),
    cursorGoal(pos(wordSample, "World"), pos(wordSample, "Hello"), "Move back to the previous word.", wordSample),
    cursorGoal(pos(wordSample, "function"), pos(wordSample, "setGreeting"), "Move to the function name.", wordSample),
    cursorGoal(pos(wordSample, "setGreeting"), pos(wordSample, "greeting"), "Move to the parameter.", wordSample),
    cursorGoal(pos(wordSample, "greeting"), pos(wordSample, "function"), "Move back to the first word.", wordSample),
    cursorGoal(pos(wordSample, "const"), pos(wordSample, "greeting", 1), "Chain word motions to the target.", wordSample),
  ];
}

function lineMotionGoals() {
  return [
    cursorGoal(p(1, 20), p(1, 0), "Use 0 to reach column zero."),
    cursorGoal(p(2, 10), p(2, 2), "Use _ to reach first non-blank."),
    cursorGoal(p(3, 4), p(3, 30), "Use $ to reach the line end."),
    cursorGoal(p(6, 4), p(6, 26), "Move to the final character."),
    cursorGoal(p(2, 20), p(2, 2), "Return to the first code character."),
    cursorGoal(p(1, 12), p(1, 0), "Go back to column zero."),
    cursorGoal(p(3, 12), p(3, 30), "Reach the end of the assignment."),
    cursorGoal(p(6, 12), p(6, 0), "Reach the line start."),
    cursorGoal(p(2, 6), p(2, 49), "Move to the call end."),
    cursorGoal(p(2, 49), p(2, 2), "Return to first non-blank."),
  ];
}

function charFindGoals() {
  return [
    cursorGoal(p(2, 2), pos(codeSample, "element"), "Find the next e.", codeSample),
    cursorGoal(pos(codeSample, "document"), pos(codeSample, "Element"), "Find E ahead.", codeSample),
    cursorGoal(pos(codeSample, "greeting", 1), pos(codeSample, "Element"), "Repeat or reverse to the target.", codeSample),
    cursorGoal(pos(codeSample, "innerText"), pos(codeSample, "element", 1), "Find e on this line.", codeSample),
    cursorGoal(pos(codeSample, "Hello"), pos(codeSample, "setGreeting", 1), "Find backward on the call.", codeSample),
    cursorGoal(p(1, 0), p(1, 20), "Find the next t.", codeSample),
    cursorGoal(p(2, 4), p(2, 18), "Find the target character.", codeSample),
    cursorGoal(p(6, 0), p(6, 16), "Find the next quote.", codeSample),
    cursorGoal(p(6, 16), p(6, 26), "Repeat the find.", codeSample),
    cursorGoal(p(3, 2), p(3, 22), "Find across the assignment.", codeSample),
  ];
}

function verticalGoals() {
  return [
    cursorGoal(p(0, 0), p(3, 0), "Use a counted jump down."),
    cursorGoal(p(3, 0), p(0, 0), "Use a counted jump up."),
    cursorGoal(p(1, 2), p(4, 0), "Move down three lines."),
    cursorGoal(p(4, 0), p(1, 0), "Move up three lines."),
    cursorGoal(p(6, 0), p(0, 0), "Reach the top."),
    cursorGoal(p(0, 0), p(6, 0), "Reach the bottom."),
    cursorGoal(p(2, 0), p(6, 0), "Jump down to the call."),
    cursorGoal(p(6, 0), p(2, 0), "Jump back to the body."),
    cursorGoal(p(1, 0), p(3, 0), "Move down by count."),
    cursorGoal(p(3, 0), p(1, 0), "Move up by count."),
  ];
}

function searchGoals() {
  return [
    cursorGoal(p(0, 0), pos(codeSample, "greeting"), "Search forward for greeting.", codeSample, ["/", "g", "r", "e", "t", "i", "n", "Enter"]),
    cursorGoal(pos(codeSample, "greeting"), pos(codeSample, "greeting", 1), "Repeat the search.", codeSample, ["n"]),
    cursorGoal(pos(codeSample, "greeting", 1), pos(codeSample, "greeting"), "Repeat backward.", codeSample, ["N"]),
    cursorGoal(pos(codeSample, "element"), pos(codeSample, "element", 1), "Search for the word under cursor.", codeSample, ["*"]),
    cursorGoal(pos(codeSample, "element", 1), pos(codeSample, "element"), "Search backward for this word.", codeSample, ["#"]),
    cursorGoal(p(6, 0), pos(codeSample, "setGreeting"), "Search backward for the call.", codeSample, ["?", "s", "e", "t", "G", "r", "i", "n", "g", "Enter"]),
    cursorGoal(p(0, 0), pos(codeSample, "document"), "Search to document.", codeSample, ["/", "d", "o", "c", "u", "m", "e", "n", "t", "Enter"]),
    cursorGoal(pos(codeSample, "document"), pos(codeSample, "document"), "Stay on the match.", codeSample, ["n", "N"]),
    cursorGoal(p(0, 0), pos(codeSample, "innerText"), "Search for innerText.", codeSample, ["/", "i", "n", "e", "r", "T", "x", "t", "Enter"]),
    cursorGoal(pos(codeSample, "innerText"), pos(codeSample, "greeting", 2), "Search to the assignment value.", codeSample, ["/", "g", "r", "e", "t", "i", "n", "Enter"]),
  ];
}

function operatorGoals(command, sample = editSample) {
  const deleteGoals = ["username", "guest", "status", "draft", "count", "render", "username", "status", "count", "render"]
    .map((needle, index) => {
      const occurrence = index > 5 && ["username", "status", "count"].includes(needle) ? 1 : 0;
      return documentGoal(pos(sample, needle, occurrence), { excludes: [needle], range: range(sample, needle, occurrence) }, "Delete the highlighted target.", sample);
    });
  const changeGoals = [["username", "member"], ["guest", "member"], ["status", "state"], ["draft", "ready"], ["count", "total"], ["render", "paint"], ["username", "name"], ["status", "phase"], ["count", "sum"], ["render", "draw"]]
    .map(([needle, replacement], index) => {
      const occurrence = index > 5 && ["username", "status", "count"].includes(needle) ? 1 : 0;
      return documentGoal(pos(sample, needle, occurrence), { excludes: [needle], includes: [replacement], insertText: replacement, range: range(sample, needle, occurrence), mode: "NORMAL" }, `Change the highlighted target to ${replacement}.`, sample);
    });
  const copyGoals = [
    [p(0, 0), "const username = \"guest\";"],
    [p(1, 0), "const status = \"draft\";"],
    [p(2, 0), "const count = 3;"],
    [p(4, 0), "render(username, status, count);"],
    [p(0, 0), "const username = \"guest\";"],
    [p(1, 0), "const status = \"draft\";"],
    [p(2, 0), "const count = 3;"],
    [p(4, 0), "render(username, status, count);"],
    [p(0, 0), "const username = \"guest\";"],
    [p(1, 0), "const status = \"draft\";"],
  ].map(([start, line]) => documentGoal(start, { includes: [`${line}\n${line}`], range: { from: start, to: p(start.line, line.length) } }, "Yank and paste the highlighted line.", sample));
  const mode = command?.includes("y") ? "copy" : command?.[0]?.toLowerCase() === "c" ? "change" : command ? "delete" : "mixed";
  const goals = mode === "copy" ? copyGoals : mode === "change" ? changeGoals : mode === "delete" ? deleteGoals : deleteGoals.slice(0, 4).concat(changeGoals.slice(0, 4), copyGoals.slice(0, 2));
  return goals.map(goal => ({ ...goal, allowed: command ? tokens(command).concat(goal.insertText ? [...goal.insertText, "Esc"] : []) : tokens(goal.insertText ? "cw" : goal.includes?.some(value => value.includes("\n")) ? "yyp" : "dw").concat(goal.insertText ? [...goal.insertText, "Esc"] : []) }));
}

function visualOperatorGoals(command) {
  return [
    documentGoal(pos(visualSample, "alpha"), { excludes: ["alpha"], range: range(visualSample, "alpha") }, "Select and operate on the highlighted word.", visualSample),
    documentGoal(pos(visualSample, "beta"), { excludes: ["beta"], range: range(visualSample, "beta") }, "Select and delete the target.", visualSample),
    documentGoal(pos(visualSample, "gamma"), { excludes: ["gamma"], range: range(visualSample, "gamma") }, "Select the highlighted word.", visualSample),
    documentGoal(pos(visualSample, "ready"), { excludes: ["ready"], includes: ["active"], insertText: "active", range: range(visualSample, "ready"), mode: "NORMAL" }, "Change the selected text.", visualSample),
    documentGoal(pos(visualSample, "draft"), { excludes: ["draft"], includes: ["review"], insertText: "review", range: range(visualSample, "draft"), mode: "NORMAL" }, "Change the selected value.", visualSample),
    documentGoal(pos(visualSample, "done"), { excludes: ["done"], range: range(visualSample, "done") }, "Delete the selected value.", visualSample),
    documentGoal(p(0, 0), { excludes: ["const alpha"], range: { from: p(0, 0), to: p(0, 22) } }, "Operate on the highlighted line.", visualSample),
    documentGoal(p(1, 0), { excludes: ["const beta"], range: { from: p(1, 0), to: p(1, 21) } }, "Operate on this line.", visualSample),
    documentGoal(p(2, 0), { excludes: ["const gamma"], range: { from: p(2, 0), to: p(2, 21) } }, "Operate on the final line.", visualSample),
    documentGoal(pos(visualSample, "alpha"), { includes: ["const alpha = \"ready\";\nconst alpha = \"ready\";"], range: { from: p(0, 0), to: p(0, 22) } }, "Yank and paste the selected line.", visualSample),
  ].map(goal => ({ ...goal, allowed: command ? tokens(command).concat(goal.insertText ? [...goal.insertText, "Esc"] : []) : goal.allowed }));
}

function bracketGoals(command) {
  const deleteGoals = ["user", "guest", "reader", "editor", "theme", "color", "green", "draft paragraph", "writeReport", "config"]
    .map((needle, index) => documentGoal(pos(bracketSample, needle, needle === "config" ? 1 : 0), { excludes: [needle], range: range(bracketSample, needle, needle === "config" ? 1 : 0) }, "Delete the highlighted text object.", bracketSample));
  const changeGoals = [["user", "account"], ["guest", "admin"], ["reader", "owner"], ["editor", "writer"], ["theme", "style"], ["green", "blue"], ["draft paragraph", "final paragraph"], ["writeReport", "saveReport"], ["config", "options"], ["color", "tone"]]
    .map(([needle, replacement]) => documentGoal(pos(bracketSample, needle, needle === "config" ? 1 : 0), { excludes: [needle], includes: [replacement], insertText: replacement, range: range(bracketSample, needle, needle === "config" ? 1 : 0), mode: "NORMAL" }, `Change the highlighted object to ${replacement}.`, bracketSample));
  const mode = command?.[0]?.toLowerCase() === "c" ? "change" : command ? "delete" : "mixed";
  const goals = mode === "change" ? changeGoals : mode === "delete" ? deleteGoals : deleteGoals.slice(0, 5).concat(changeGoals.slice(0, 5));
  return goals.map(goal => ({ ...goal, allowed: command ? tokens(command).concat(goal.insertText ? [...goal.insertText, "Esc"] : []) : tokens(goal.insertText ? "ciw" : "diw").concat(goal.insertText ? [...goal.insertText, "Esc"] : []) }));
}

function paragraphGoals(command) {
  const deleteGoals = [
    documentGoal(p(0, 0), { excludes: ["first paragraph line one"], range: { from: p(0, 0), to: p(1, 24) } }, "Operate on the first paragraph.", paragraphSample),
    documentGoal(p(3, 0), { excludes: ["second paragraph line one"], range: { from: p(3, 0), to: p(4, 25) } }, "Operate on the second paragraph.", paragraphSample),
    documentGoal(p(6, 0), { excludes: ["third paragraph line one"], range: { from: p(6, 0), to: p(7, 24) } }, "Operate on the third paragraph.", paragraphSample),
    documentGoal(p(1, 0), { excludes: ["first paragraph line two"], range: { from: p(1, 0), to: p(1, 24) } }, "Delete inside the paragraph.", paragraphSample),
    documentGoal(p(4, 0), { excludes: ["second paragraph line two"], range: { from: p(4, 0), to: p(4, 25) } }, "Delete around the paragraph.", paragraphSample),
    documentGoal(p(7, 0), { excludes: ["third paragraph line two"], range: { from: p(7, 0), to: p(7, 24) } }, "Delete the paragraph text.", paragraphSample),
    documentGoal(p(0, 0), { excludes: ["first paragraph"], range: { from: p(0, 0), to: p(1, 24) } }, "Delete this paragraph.", paragraphSample),
    documentGoal(p(3, 0), { excludes: ["second paragraph"], range: { from: p(3, 0), to: p(4, 25) } }, "Delete this paragraph.", paragraphSample),
    documentGoal(p(6, 0), { excludes: ["third paragraph"], range: { from: p(6, 0), to: p(7, 24) } }, "Delete this paragraph.", paragraphSample),
    documentGoal(p(0, 0), { excludes: ["first paragraph line one"], range: { from: p(0, 0), to: p(1, 24) } }, "Finish the paragraph drill.", paragraphSample),
  ];
  const changeGoals = [
    documentGoal(p(0, 0), { excludes: ["first paragraph"], includes: ["opening paragraph"], insertText: "opening paragraph", range: { from: p(0, 0), to: p(0, 15) }, mode: "NORMAL" }, "Change the paragraph text.", paragraphSample),
    documentGoal(p(3, 0), { excludes: ["second paragraph"], includes: ["middle paragraph"], insertText: "middle paragraph", range: { from: p(3, 0), to: p(3, 16) }, mode: "NORMAL" }, "Change inside this paragraph.", paragraphSample),
    documentGoal(p(7, 0), { excludes: ["third paragraph line two"], includes: ["closing paragraph"], insertText: "closing paragraph", range: { from: p(7, 0), to: p(7, 24) }, mode: "NORMAL" }, "Change the paragraph.", paragraphSample),
    documentGoal(p(0, 0), { excludes: ["first paragraph"], includes: ["intro paragraph"], insertText: "intro paragraph", range: { from: p(0, 0), to: p(0, 15) }, mode: "NORMAL" }, "Change this paragraph.", paragraphSample),
    documentGoal(p(3, 0), { excludes: ["second paragraph"], includes: ["body paragraph"], insertText: "body paragraph", range: { from: p(3, 0), to: p(3, 16) }, mode: "NORMAL" }, "Change this paragraph.", paragraphSample),
    documentGoal(p(6, 0), { excludes: ["third paragraph"], includes: ["ending paragraph"], insertText: "ending paragraph", range: { from: p(6, 0), to: p(6, 15) }, mode: "NORMAL" }, "Change this paragraph.", paragraphSample),
    documentGoal(p(1, 0), { excludes: ["first paragraph line two"], includes: ["new second line"], insertText: "new second line", range: { from: p(1, 0), to: p(1, 24) }, mode: "NORMAL" }, "Change inside the paragraph.", paragraphSample),
    documentGoal(p(4, 0), { excludes: ["second paragraph line two"], includes: ["updated middle line"], insertText: "updated middle line", range: { from: p(4, 0), to: p(4, 25) }, mode: "NORMAL" }, "Change around the paragraph.", paragraphSample),
    documentGoal(p(7, 0), { excludes: ["third paragraph line two"], includes: ["updated final line"], insertText: "updated final line", range: { from: p(7, 0), to: p(7, 24) }, mode: "NORMAL" }, "Change the paragraph.", paragraphSample),
    documentGoal(p(0, 0), { excludes: ["first paragraph line one"], includes: ["replacement paragraph"], insertText: "replacement paragraph", range: { from: p(0, 0), to: p(1, 24) }, mode: "NORMAL" }, "Finish the paragraph drill.", paragraphSample),
  ];
  const mode = command?.[0]?.toLowerCase() === "c" ? "change" : command ? "delete" : "mixed";
  const goals = mode === "change" ? changeGoals : mode === "delete" ? deleteGoals : deleteGoals.slice(0, 5).concat(changeGoals.slice(0, 5));
  return goals.map(goal => ({ ...goal, allowed: command ? tokens(command).concat(goal.insertText ? [...goal.insertText, "Esc"] : []) : tokens(goal.insertText ? "cip" : "dip").concat(goal.insertText ? [...goal.insertText, "Esc"] : []) }));
}

const introGoals = [
  modeGoal(p(0, 0), "INSERT", "Enter insert mode.", editSample, ["i"]),
  { ...modeGoal(p(0, 0), "NORMAL", "Return to normal mode.", editSample, ["Esc"]), startMode: "INSERT" },
  modeGoal(p(1, 6), "INSERT", "Append after the cursor.", editSample, ["a"]),
  { ...modeGoal(p(1, 6), "NORMAL", "Leave insert mode again.", editSample, ["Esc"]), startMode: "INSERT" },
  modeGoal(p(2, 0), "INSERT", "Enter insert mode once more.", editSample, ["i"]),
  { ...modeGoal(p(2, 0), "NORMAL", "Finish in normal mode.", editSample, ["Esc"]), startMode: "INSERT" },
];

const insertGoals = [
  documentGoal(pos(editSample, "guest"), { includes: ["\"demo-guest\""], insertText: "demo-", range: range(editSample, "guest"), mode: "NORMAL" }, "Add the demo- prefix inside the username string."),
  documentGoal(pos(editSample, "draft"), { includes: ["\"draft-ready\""], insertText: "-ready", range: range(editSample, "draft"), mode: "NORMAL" }, "Mark the draft status as ready."),
  documentGoal(pos(editSample, "count"), { includes: ["const total_count"], insertText: "total_", range: range(editSample, "count"), mode: "NORMAL" }, "Rename count by adding the total_ prefix."),
  documentGoal(pos(editSample, "render"), { includes: ["renderNow"], insertText: "Now", range: range(editSample, "render"), mode: "NORMAL" }, "Turn the render call into renderNow."),
  documentGoal(pos(editSample, "status"), { includes: ["const current_status"], insertText: "current_", range: range(editSample, "status"), mode: "NORMAL" }, "Rename status by adding current_."),
  documentGoal(pos(editSample, "3"), { includes: ["30"], insertText: "0", range: range(editSample, "3"), mode: "NORMAL" }, "Change the retry count from 3 to 30."),
  documentGoal(pos(editSample, "username", 1), { includes: ["activeUsername"], insertText: "active", range: range(editSample, "username", 1), mode: "NORMAL" }, "Pass activeUsername to render."),
  documentGoal(pos(editSample, "count", 1), { includes: ["countValue"], insertText: "Value", range: range(editSample, "count", 1), mode: "NORMAL" }, "Pass countValue to render."),
  documentGoal(pos(editSample, "guest"), { includes: ["guest user"], insertText: " user", range: range(editSample, "guest"), mode: "NORMAL" }, "Expand the username string to guest user."),
  documentGoal(pos(editSample, "draft"), { includes: ["final draft"], insertText: "final ", range: range(editSample, "draft"), mode: "NORMAL" }, "Make the status string final draft."),
];

const lineInsertGoals = [
  documentGoal(p(0, 8), { includes: ["export const username"], insertText: "export ", range: { from: p(0, 0), to: p(0, 5) }, mode: "NORMAL" }, "Export the username constant."),
  documentGoal(p(0, 8), { includes: ["\"guest\"; // default user"], insertText: " // default user", range: { from: p(0, 23), to: p(0, 24) }, mode: "NORMAL" }, "Comment why username defaults to guest."),
  documentGoal(p(1, 8), { includes: ["export const status"], insertText: "export ", range: { from: p(1, 0), to: p(1, 5) }, mode: "NORMAL" }, "Export the status constant."),
  documentGoal(p(1, 8), { includes: ["\"draft\"; // pending review"], insertText: " // pending review", range: { from: p(1, 22), to: p(1, 23) }, mode: "NORMAL" }, "Add the pending review comment."),
  documentGoal(p(2, 8), { includes: ["export const count"], insertText: "export ", range: { from: p(2, 0), to: p(2, 5) }, mode: "NORMAL" }, "Export the count constant."),
  documentGoal(p(2, 8), { includes: ["3; // max retries"], insertText: " // max retries", range: { from: p(2, 15), to: p(2, 16) }, mode: "NORMAL" }, "Document count as max retries."),
  documentGoal(p(4, 8), { includes: ["return render"], insertText: "return ", range: { from: p(4, 0), to: p(4, 6) }, mode: "NORMAL" }, "Return the render result."),
  documentGoal(p(4, 8), { includes: ["count); // hydrate view"], insertText: " // hydrate view", range: { from: p(4, 30), to: p(4, 31) }, mode: "NORMAL" }, "Comment the render call."),
  documentGoal(p(0, 8), { includes: ["const username = \"guest\"; // TODO rename"], insertText: " // TODO rename", range: { from: p(0, 23), to: p(0, 24) }, mode: "NORMAL" }, "Add a TODO at the end of username."),
  documentGoal(p(1, 8), { includes: ["export const status"], insertText: "export ", range: { from: p(1, 0), to: p(1, 5) }, mode: "NORMAL" }, "Export the status constant."),
];

const openGoals = [
  documentGoal(p(0, 0), { includes: ["settings:\n  timeout: 30"], insertText: "  timeout: 30", range: { from: p(0, 0), to: p(0, 9) }, mode: "NORMAL" }, "Add timeout under settings.", openSample),
  documentGoal(p(1, 2), { includes: ["  owner: platform\n  retries: 3"], insertText: "  owner: platform", range: { from: p(1, 0), to: p(1, 12) }, mode: "NORMAL" }, "Add owner above retries.", openSample),
  documentGoal(p(3, 0), { includes: ["services:\n  worker: enabled"], insertText: "  worker: enabled", range: { from: p(3, 0), to: p(3, 9) }, mode: "NORMAL" }, "Add worker under services.", openSample),
  documentGoal(p(4, 2), { includes: ["  web: enabled\n  api: enabled"], insertText: "  web: enabled", range: { from: p(4, 0), to: p(4, 14) }, mode: "NORMAL" }, "Add web above api.", openSample),
  documentGoal(p(6, 0), { includes: ["alerts:\n  sms: false"], insertText: "  sms: false", range: { from: p(6, 0), to: p(6, 7) }, mode: "NORMAL" }, "Add sms under alerts.", openSample),
  documentGoal(p(7, 2), { includes: ["  slack: true\n  email: true"], insertText: "  slack: true", range: { from: p(7, 0), to: p(7, 13) }, mode: "NORMAL" }, "Add slack above email.", openSample),
  documentGoal(p(0, 0), { includes: ["settings:\n  cache: true"], insertText: "  cache: true", range: { from: p(0, 0), to: p(0, 9) }, mode: "NORMAL" }, "Add cache under settings.", openSample),
  documentGoal(p(4, 2), { includes: ["  jobs: enabled\n  api: enabled"], insertText: "  jobs: enabled", range: { from: p(4, 0), to: p(4, 14) }, mode: "NORMAL" }, "Add jobs above api.", openSample),
  documentGoal(p(6, 0), { includes: ["alerts:\n  pager: false"], insertText: "  pager: false", range: { from: p(6, 0), to: p(6, 7) }, mode: "NORMAL" }, "Add pager under alerts.", openSample),
  documentGoal(p(1, 2), { includes: ["  region: eu\n  retries: 3"], insertText: "  region: eu", range: { from: p(1, 0), to: p(1, 12) }, mode: "NORMAL" }, "Add region above retries.", openSample),
];

const smallEditGoals = [
  documentGoal(p(0, 1), { excludes: ["cnost"], includes: ["const var temperature = 5;"], insertText: "n", range: { from: p(0, 1), to: p(0, 2) }, mode: "NORMAL" }, "Fix cnost to const: delete the misplaced n, then insert n after o.", "cnost var temperature = 5;", ["x", "a", "n", "Esc"]),
  documentGoal(p(0, 3), { excludes: ["retrun"], includes: ["return formatName(user);"], insertText: "r", range: { from: p(0, 3), to: p(0, 4) }, mode: "NORMAL" }, "Fix retrun to return: delete the misplaced r, then insert r after u.", "retrun formatName(user);", ["x", "a", "r", "Esc"]),
  documentGoal(p(0, 10), { excludes: ["colour"], includes: ["const color = \"blue\";"], range: { from: p(0, 10), to: p(0, 11) } }, "Fix colour to color by deleting u.", "const colour = \"blue\";", ["x"]),
  documentGoal(p(0, 17), { excludes: ["1;"], includes: ["const maxItems = 5;"], range: { from: p(0, 17), to: p(0, 18) } }, "Change maxItems from 1 to 5.", "const maxItems = 1;", ["r", "5"]),
  documentGoal(p(0, 17), { excludes: ["prodction"], includes: ["const env = \"production\";"], insertText: "uc", range: { from: p(0, 17), to: p(0, 18) }, mode: "NORMAL" }, "Fix prodction to production by substituting c with uc.", "const env = \"prodction\";", ["s", "u", "c", "Esc"]),
  documentGoal(p(0, 10), { excludes: ["portt"], includes: ["const port = 3000;"], range: { from: p(0, 10), to: p(0, 11) } }, "Fix portt to port by deleting the extra t.", "const portt = 3000;", ["x"]),
  documentGoal(p(0, 17), { excludes: ["eror"], includes: ["const level = \"error\";"], insertText: "ro", range: { from: p(0, 17), to: p(0, 18) }, mode: "NORMAL" }, "Fix eror to error by substituting o with ro.", "const level = \"eror\";", ["s", "r", "o", "Esc"]),
  documentGoal(p(0, 9), { excludes: ["lgo"], includes: ["console.log(total);"], insertText: "g", range: { from: p(0, 9), to: p(0, 10) }, mode: "NORMAL" }, "Fix lgo to log: delete g, then insert g after o.", "console.lgo(total);", ["x", "a", "g", "Esc"]),
  documentGoal(p(0, 19), { excludes: ["recive"], includes: ["const action = \"receive\";"], insertText: "ei", range: { from: p(0, 19), to: p(0, 20) }, mode: "NORMAL" }, "Fix recive to receive by substituting i with ei.", "const action = \"recive\";", ["s", "e", "i", "Esc"]),
  documentGoal(p(0, 2), { excludes: ["rener"], includes: ["render(page);"], insertText: "d", range: { from: p(0, 2), to: p(0, 3) }, mode: "NORMAL" }, "Fix rener to render by inserting d after n.", "rener(page);", ["a", "d", "Esc"]),
];

export const groups = [
  ["Basic Vim", [
    lesson("Intro to modes", ["i", "a", "Esc"], { sample: editSample, goals: introGoals, demo: ["i", text("active "), "Esc"], summary: "Switch between normal and insert mode on demand." }),
    lesson("Basic Movement", ["h", "j", "k", "l"], { goals: makeCursorGoals(codeSample), demo: ["l", "l", "j", "h", "k"], summary: "Move to each green target with hjkl." }),
    lesson("Moving by Words", ["w", "e", "b"], { sample: wordSample, goals: wordGoals(), demo: ["w", "w", "e", "b"], summary: "Jump between word targets with w, e, and b." }),
    lesson("Insert Mode", ["i", "a", "Esc"], { sample: editSample, goals: insertGoals, demo: ["i", text("new "), "Esc", "a", text("-ready"), "Esc"], summary: "Insert text at the highlighted position, then return to normal mode." }),
  ]],
  ["Insert Like a Pro", [
    lesson("Insert at Line Ends", ["I", "A", "Esc"], { sample: editSample, goals: lineInsertGoals, demo: ["I", text("let "), "Esc", "A", text(" // active"), "Esc"] }),
    lesson("Opening New Lines", ["o", "O", "Esc"], { sample: openSample, goals: openGoals, demo: ["o", text("  timeout: 30"), "Esc", "O", text("  owner: platform"), "Esc"] }),
    lesson("Making Small Edits", ["s", "x", "r"], { sample: smallEditGoals[0].sample, goals: smallEditGoals, demo: ["x", "a", text("n"), "Esc"] }),
  ]],
  ["Essential Motions", [
    lesson("Moving by WORDs", ["W", "E", "B"], { sample: wordSample, goals: wordGoals(), demo: ["W", "W", "E", "B"] }),
    lesson("Moving to Line Ends", ["0", "_", "$"], { goals: lineMotionGoals(), demo: ["$", "0", "_"] }),
    lesson("Find Character", ["f", "F", ";"], { goals: charFindGoals(), demo: ["fe", ";", "Fe"] }),
    lesson("Till Character", ["t", "T", ";"], { goals: charFindGoals(), demo: ["te", ";", "Te"] }),
  ]],
  ["Basic Operators", [
    lesson("Intro to Operators", ["d", "c", "y"], { sample: editSample, goals: operatorGoals(), demo: ["dw", "u", "cw", text("member"), "Esc"] }),
    lesson("Delete Words", ["d", "w", "Esc"], { sample: editSample, goals: operatorGoals("dw"), demo: ["dw"] }),
    lesson("Change Words", ["c", "w", "Esc"], { sample: editSample, goals: operatorGoals("cw"), demo: ["cw", text("member"), "Esc"] }),
    lesson("Delete Lines", ["d", "d", "D"], { sample: editSample, goals: operatorGoals("dd"), demo: ["dd", "u", "D"] }),
    lesson("Delete Multiple Lines", ["d", "j", "k"], { sample: editSample, goals: operatorGoals("dj"), demo: ["dj", "u", "dk"] }),
    lesson("Copy/Paste Lines", ["y", "p", "P"], { sample: editSample, goals: operatorGoals("yyp"), demo: ["yy", "p", "P"] }),
  ]],
  ["Advanced Vertical Movement", [
    lesson("Relative Line Jumps", ["3j", "3k"], { goals: verticalGoals(), demo: ["3j", "3k"] }),
    lesson("Absolute Line Jumps", ["g", "G"], { goals: verticalGoals(), demo: ["G", "gg"] }),
    lesson("Paragraph Jumps", ["}", "{"], { sample: paragraphSample, goals: verticalGoals().map(goal => ({ ...goal, sample: paragraphSample })), demo: ["}", "{"] }),
    lesson("Window Scrolls", ["Ctrl+d", "Ctrl+u"], { goals: verticalGoals(), demo: ["Ctrl+d", "Ctrl+u"] }),
  ]],
  ["Search", [
    lesson("Search", ["/", "?", "Enter"], { goals: searchGoals(), demo: ["/", text("greeting", "search"), "Enter"] }),
    lesson("Repeat Search", ["n", "N"], { goals: searchGoals(), demo: ["/", text("greeting", "search"), "Enter", "n", "N"] }),
    lesson("Quick Word Search", ["*", "#"], { goals: searchGoals(), demo: ["*", "#"] }),
    lesson("Search Review", ["/", "?", "n", "N", "*", "#"], { goals: searchGoals(), demo: ["/", text("element", "search"), "Enter", "n", "N", "*"] }),
  ]],
  ["Text Objects - Bracket Pairs", [
    lesson("Intro to Text Objects", ["d", "i", "w"], { sample: bracketSample, goals: bracketGoals("diw"), demo: ["diw", "u"] }),
    lesson("Delete Inside Brackets", ["d", "i", "{"], { sample: bracketSample, goals: bracketGoals("di{"), demo: ["di{"] }),
    lesson("Delete Around Brackets", ["d", "a", "{"], { sample: bracketSample, goals: bracketGoals("da{"), demo: ["da{"] }),
    lesson("Change Inside Brackets", ["c", "i", "{", "Esc"], { sample: bracketSample, goals: bracketGoals("ci{"), demo: ["ci{", text("value"), "Esc"] }),
    lesson("Change Around Brackets", ["c", "a", "{", "Esc"], { sample: bracketSample, goals: bracketGoals("ca{"), demo: ["ca{", text("value"), "Esc"] }),
    lesson("Brackets Review", ["d", "c", "i", "a", "{"], { sample: bracketSample, goals: bracketGoals(), demo: ["di{", "u", "ca{", text("value"), "Esc"] }),
  ]],
  ["Text Objects - Quotes", [
    lesson("Delete Inside Quotes", ["d", "i", "\""], { sample: bracketSample, goals: bracketGoals("di\""), demo: ["di\""] }),
    lesson("Delete Around Quotes", ["d", "a", "\""], { sample: bracketSample, goals: bracketGoals("da\""), demo: ["da\""] }),
    lesson("Change Inside Quotes", ["c", "i", "\"", "Esc"], { sample: bracketSample, goals: bracketGoals("ci\""), demo: ["ci\"", text("final"), "Esc"] }),
    lesson("Change Around Quotes", ["c", "a", "\"", "Esc"], { sample: bracketSample, goals: bracketGoals("ca\""), demo: ["ca\"", text("final"), "Esc"] }),
    lesson("Quotes Review", ["d", "c", "i", "a", "\""], { sample: bracketSample, goals: bracketGoals(), demo: ["di\"", "u", "ca\"", text("final"), "Esc"] }),
  ]],
  ["Text Objects - Words", [
    lesson("Delete Inside Word", ["d", "i", "w"], { sample: editSample, goals: operatorGoals("diw"), demo: ["diw"] }),
    lesson("Delete Around Word", ["d", "a", "w"], { sample: editSample, goals: operatorGoals("daw"), demo: ["daw"] }),
    lesson("Change Inside Word", ["c", "i", "w", "Esc"], { sample: editSample, goals: operatorGoals("ciw"), demo: ["ciw", text("member"), "Esc"] }),
    lesson("Words Review", ["d", "c", "i", "a", "w"], { sample: editSample, goals: operatorGoals(), demo: ["diw", "u", "daw", "u", "ciw", text("member"), "Esc"] }),
  ]],
  ["Text Objects - Paragraphs", [
    lesson("Delete Inside Paragraph", ["d", "i", "p"], { sample: paragraphSample, goals: paragraphGoals("dip"), demo: ["dip"] }),
    lesson("Delete Around Paragraph", ["d", "a", "p"], { sample: paragraphSample, goals: paragraphGoals("dap"), demo: ["dap"] }),
    lesson("Change Inside Paragraph", ["c", "i", "p", "Esc"], { sample: paragraphSample, goals: paragraphGoals("cip"), demo: ["cip", text("replacement paragraph"), "Esc"] }),
    lesson("Paragraphs Review", ["d", "c", "i", "a", "p"], { sample: paragraphSample, goals: paragraphGoals(), demo: ["dip", "u", "dap", "u", "cip", text("replacement paragraph"), "Esc"] }),
  ]],
  ["Text Objects - Mega Review", [
    lesson("Text Objects Mega Review", ["d", "c", "i", "a", "{", "\"", "w", "p"], { sample: bracketSample, goals: bracketGoals().concat(paragraphGoals()).slice(0, 15), demo: ["di{", "u", "ci\"", text("final"), "Esc", "daw", "u"] }),
  ]],
  ["Visual Mode", [
    lesson("Intro to Visual Mode", ["v", "Esc"], { sample: visualSample, goals: [modeGoal(p(0, 0), "VISUAL", "Enter visual mode.", visualSample, ["v"]), { ...modeGoal(p(0, 0), "NORMAL", "Return to normal mode.", visualSample, ["Esc"]), startMode: "VISUAL" }], demo: ["v", "Esc"] }),
    lesson("Visual Mode Operators", ["v", "d", "c", "y"], { sample: visualSample, goals: visualOperatorGoals("vwd"), demo: ["vwd", "u", "vwy"] }),
    lesson("Switch Selection Ends", ["v", "o", "Esc"], { sample: visualSample, goals: [modeGoal(p(0, 0), "VISUAL", "Start a visual selection.", visualSample, ["v"]), cursorGoal(p(0, 0), p(0, 5), "Switch selection ends and move.", visualSample, ["v", "o", "l"])], demo: ["v", "w", "o", "Esc"] }),
    lesson("Visual Line Mode", ["V", "Esc"], { sample: visualSample, goals: [modeGoal(p(0, 0), "VISUAL LINE", "Enter visual line mode.", visualSample, ["V"]), { ...modeGoal(p(0, 0), "NORMAL", "Return to normal mode.", visualSample, ["Esc"]), startMode: "VISUAL LINE" }], demo: ["V", "Esc"] }),
    lesson("Switch Visual Line Ends", ["V", "o", "Esc"], { sample: visualSample, goals: [modeGoal(p(0, 0), "VISUAL LINE", "Start visual line mode.", visualSample, ["V"]), cursorGoal(p(0, 0), p(1, 0), "Switch ends and move a line.", visualSample, ["V", "o", "j"])], demo: ["V", "j", "o", "Esc"] }),
    lesson("Visual Line Operators", ["V", "d", "c", "y"], { sample: visualSample, goals: visualOperatorGoals("Vd"), demo: ["Vd", "u", "Vy"] }),
  ]],
];

export const lessons = groups.flatMap(([group, items]) =>
  items.map((item, index) => ({ ...item, group, id: slug(group, item.title, index) }))
);

export function slug(group, title, index) {
  return `${group}-${title}-${index}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function createRun(lessonIndex = 0) {
  return {
    lessonIndex,
    goalIndex: 0,
    attempts: 0,
    wrong: 0,
    startedAt: null,
    completedAt: null,
    lastKey: "",
    message: "Reach the highlighted goal.",
    done: new Set(JSON.parse(globalThis.localStorage?.getItem("doneLessons") || "[]")),
  };
}

export const createState = createRun;

export function currentGoal(run) {
  return lessons[run.lessonIndex].goals[run.goalIndex];
}

export function recordKey(run, vimKey, now = Date.now()) {
  const key = normalizeVimKey(vimKey);
  const goal = currentGoal(run);
  if (!goal || run.completedAt) return run;
  run.attempts += 1;
  if (allowedKeys(lessons[run.lessonIndex], goal).has(key)) {
    if (run.startedAt === null) run.startedAt = now;
  } else {
    run.wrong += 1;
  }
  run.lastKey = key;
  return run;
}

export function checkGoal(run, snapshot, now = Date.now()) {
  const goal = currentGoal(run);
  if (!goal || run.completedAt || !goalReached(goal, snapshot)) return false;
  finishGoal(run, now);
  return true;
}

export function finishGoal(run, now = Date.now()) {
  const lesson = lessons[run.lessonIndex];
  run.goalIndex += 1;
  if (run.goalIndex >= lesson.goals.length) {
    run.completedAt = now;
    run.done.add(lesson.id);
    globalThis.localStorage?.setItem("doneLessons", JSON.stringify([...run.done]));
    run.message = "Run complete.";
  } else {
    run.message = "Target hit. Keep going.";
  }
  return run;
}

export function runStats(run, now = Date.now()) {
  const finishedAt = run.completedAt || now;
  const elapsedMs = run.startedAt === null ? 0 : Math.max(0, finishedAt - run.startedAt);
  const minutes = elapsedMs / 60000;
  const correct = Math.max(0, run.attempts - run.wrong);
  return {
    elapsedMs,
    accuracy: run.attempts ? Math.round((correct / run.attempts) * 100) : 100,
    speed: minutes ? run.goalIndex / minutes : 0,
  };
}

function allowedKeys(lesson, goal) {
  const keys = new Set((goal.allowed || lesson.commands.flatMap(tokens)).map(normalizeVimKey));
  for (const char of goal.insertText || "") keys.add(char);
  if (goal.mode === "NORMAL") keys.add("Esc");
  return keys;
}

function goalReached(goal, snapshot) {
  if (goal.mode && snapshot.mode !== goal.mode) return false;
  if (goal.type === "cursor") return samePos(snapshot.cursor, goal.at);
  if (goal.type === "mode") return snapshot.mode === goal.mode;
  if (goal.type !== "document") return false;
  const text = snapshot.text || "";
  return (goal.includes || []).every(value => text.includes(value)) &&
    (goal.excludes || []).every(value => !text.includes(value));
}

function samePos(a, b) {
  return a && b && a.line === b.line && a.ch === b.ch;
}

export function tokens(command) {
  const out = [];
  for (const part of String(command).split(" ")) {
    if (!part) continue;
    if (part === "Esc" || part === "Enter" || part.startsWith("Ctrl+")) out.push(part);
    else out.push(...part);
  }
  return out;
}

export function normalizeVimKey(key) {
  if (key === "<Esc>") return "Esc";
  if (key === "<CR>") return "Enter";
  const ctrl = /^<C-(.)>$/i.exec(key);
  return ctrl ? `Ctrl+${ctrl[1].toLowerCase()}` : key;
}

export function toVimKey(key) {
  if (key === "Esc") return "<Esc>";
  if (key === "Enter") return "<CR>";
  const ctrl = /^Ctrl\+(.)$/i.exec(key);
  return ctrl ? `<C-${ctrl[1].toLowerCase()}>` : key;
}

export function demoSteps(lesson) {
  const steps = [];
  for (const item of lesson.demo) {
    if (typeof item === "string") {
      for (const key of tokens(item)) steps.push({ key, pace: 760, target: "command" });
    } else {
      for (const key of item.text) steps.push({ key, pace: 95, target: item.target || "insert" });
    }
  }
  return steps;
}

export function demoTokens(lesson) {
  return demoSteps(lesson).map(step => step.key);
}

export function visibleText(value) {
  return String(value).replaceAll(" ", "[space]").replaceAll("\n", "[enter]");
}

export function insertionPoint(goal) {
  if (!goal.insertText || goal.excludes?.length || !goal.range) return null;
  return insertionSide(goal) === "after" ? goal.range.to : goal.range.from;
}

export function placementText(goal) {
  const point = insertionPoint(goal);
  if (!point) return "";
  const base = rangeText(goal.sample, goal.range).trim();
  const side = samePos(point, goal.range.to) ? "after" : "before";
  const line = /open|new line/i.test(goal.hint || "") ? "on a new line " : "";
  return `${line}${side} ${base ? `"${base}"` : "the green caret"}`;
}

function insertionSide(goal) {
  const base = rangeText(goal.sample, goal.range);
  const expected = (goal.includes || []).join("\n");
  if (expected.includes(`${base}${goal.insertText}`) || expected.includes(`${base}\n${goal.insertText}`)) return "after";
  return "before";
}

function rangeText(sample, rangeValue) {
  const lines = sample.split("\n");
  if (rangeValue.from.line === rangeValue.to.line) return lines[rangeValue.from.line].slice(rangeValue.from.ch, rangeValue.to.ch);
  return [
    lines[rangeValue.from.line].slice(rangeValue.from.ch),
    ...lines.slice(rangeValue.from.line + 1, rangeValue.to.line),
    lines[rangeValue.to.line].slice(0, rangeValue.to.ch),
  ].join("\n");
}

function pos(sample, needle, occurrence = 0, add = 0) {
  let index = -1;
  for (let count = 0; count <= occurrence; count += 1) index = sample.indexOf(needle, index + 1);
  if (index < 0) throw new Error(`Missing sample text: ${needle}`);
  return offsetToPos(sample, index + add);
}

function range(sample, needle, occurrence = 0) {
  const from = pos(sample, needle, occurrence);
  return { from, to: offsetPos(sample, from, needle.length) };
}

function offsetToPos(sample, offset) {
  const lines = sample.slice(0, offset).split("\n");
  return { line: lines.length - 1, ch: lines.at(-1).length };
}

function offsetPos(sample, from, add) {
  const lines = sample.split("\n");
  let line = from.line;
  let ch = from.ch + add;
  while (line < lines.length && ch > lines[line].length) {
    ch -= lines[line].length + 1;
    line += 1;
  }
  return { line, ch };
}

function mount() {
  const nav = document.querySelector("#nav");
  const title = document.querySelector("#title");
  const summary = document.querySelector("#summary");
  const commands = document.querySelector("#commands");
  const tutorialTitle = document.querySelector("#tutorial-title");
  const tutorialStatus = document.querySelector("#tutorial-status");
  const playDemo = document.querySelector("#play-demo");
  const demoKey = document.querySelector("#demo-key");
  const mode = document.querySelector("#mode");
  const target = document.querySelector("#target");
  const goalCount = document.querySelector("#goal-count");
  const timer = document.querySelector("#timer");
  const accuracy = document.querySelector("#accuracy");
  const speed = document.querySelector("#speed");
  const practiceTip = document.querySelector(".practice-tip");
  const toast = document.querySelector("#toast");
  const visualGuide = document.querySelector("#visual-guide");
  const editorEl = document.querySelector("#editor");
  const demoEl = document.querySelector("#demo-editor");
  let run = createRun();
  let currentMode = "NORMAL";
  let marks = [];
  let demoTimers = [];
  let timerId = 0;
  let preparing = false;
  const cm = CodeMirror.fromTextArea(editorEl, {
    value: currentGoal(run).sample,
    mode: "javascript",
    theme: "material-darker",
    keyMap: "vim",
    lineNumbers: true,
    indentUnit: 2,
    tabSize: 2,
  });
  const demoCm = CodeMirror.fromTextArea(demoEl, {
    value: lessons[run.lessonIndex].sample,
    mode: "javascript",
    theme: "material-darker",
    keyMap: "vim",
    lineNumbers: true,
    indentUnit: 2,
    tabSize: 2,
    readOnly: false,
  });

  function startTimer() {
    clearInterval(timerId);
    timerId = setInterval(drawStats, 250);
  }

  function prepareGoal() {
    preparing = true;
    clearMarks();
    const goal = currentGoal(run);
    if (!goal) {
      preparing = false;
      return;
    }
    currentMode = "NORMAL";
    cm.setValue(goal.sample || lessons[run.lessonIndex].sample);
    cm.setCursor(goal.start || p(0, 0));
    CodeMirror.Vim.exitInsertMode(cm);
    if (goal.startMode === "INSERT") {
      CodeMirror.Vim.handleKey(cm, "i", "user");
      currentMode = "INSERT";
    } else if (goal.startMode === "VISUAL") {
      CodeMirror.Vim.handleKey(cm, "v", "user");
      currentMode = "VISUAL";
    } else if (goal.startMode === "VISUAL LINE") {
      CodeMirror.Vim.handleKey(cm, "V", "user");
      currentMode = "VISUAL LINE";
    }
    markGoal(goal);
    drawGuide();
    queueGuide();
    preparing = false;
    draw();
  }

  function showGoal() {
    clearMarks();
    const goal = currentGoal(run);
    if (goal) markGoal(goal);
    drawGuide();
    queueGuide();
    draw();
  }

  function resetDemo() {
    demoTimers.forEach(clearTimeout);
    demoTimers = [];
    demoCm.setValue(lessons[run.lessonIndex].sample);
    demoCm.setCursor(currentGoal(run)?.start || p(0, 0));
    CodeMirror.Vim.exitInsertMode(demoCm);
    tutorialStatus.textContent = "paused";
    showDemoKey("");
    playDemo.textContent = "Play";
  }

  function playTutorial() {
    resetDemo();
    const steps = demoSteps(lessons[run.lessonIndex]);
    let delay = 0;
    tutorialStatus.textContent = "playing";
    playDemo.textContent = "Replay";
    demoCm.focus();
    steps.forEach((step, index) => {
      delay += step.pace;
      demoTimers.push(setTimeout(() => {
        demoCm.focus();
        sendDemoStep(demoCm, step);
        tutorialStatus.textContent = `input: ${step.key}`;
        showDemoKey(step.key);
        if (index === steps.length - 1) {
          tutorialStatus.textContent = "finished";
          demoTimers.push(setTimeout(() => showDemoKey(""), 700));
        }
      }, delay));
    });
  }

  function drawNav() {
    nav.innerHTML = groups.map(([group, items]) => {
      const links = items.map(name => {
        const index = lessons.findIndex(lessonItem => lessonItem.group === group && lessonItem.title === name.title);
        const lessonItem = lessons[index];
        const active = index === run.lessonIndex ? " active" : "";
        const done = run.done.has(lessonItem.id) ? " done" : "";
        const keys = lessonItem.commands.slice(0, 4).map(key => `<span class="mini-kbd">${escapeHtml(shortKey(key))}</span>`).join("");
        return `<button class="lesson-btn${active}${done}" data-index="${index}" type="button"><span class="lesson-name">${escapeHtml(name.title)}</span><span class="lesson-keys" aria-label="Shortcuts">${keys}</span></button>`;
      }).join("");
      return `<div class="group-title">${escapeHtml(group)}</div>${links}`;
    }).join("");
  }

  function draw() {
    const lessonItem = lessons[run.lessonIndex];
    const goal = currentGoal(run);
    title.textContent = lessonItem.title;
    summary.textContent = lessonItem.summary;
    commands.innerHTML = lessonItem.commands.map(key => `<kbd>${escapeHtml(key)}</kbd>`).join("");
    tutorialTitle.textContent = `${lessonItem.title} example`;
    target.textContent = goal ? objectiveText(goal) : "All goals complete.";
    practiceTip.dataset.tip = goal ? objectiveText(goal) : "All goals complete.";
    toast.textContent = run.message;
    toast.className = `toast ${run.completedAt ? "ok" : "muted"}`;
    mode.textContent = currentMode;
    drawStats();
    drawNav();
  }

  function drawStats() {
    const stats = runStats(run, performance.now());
    goalCount.textContent = `${Math.min(run.goalIndex, lessons[run.lessonIndex].goals.length)} / ${lessons[run.lessonIndex].goals.length} goals`;
    timer.textContent = formatTime(stats.elapsedMs);
    accuracy.textContent = `${stats.accuracy}% accuracy`;
    speed.textContent = `${stats.speed.toFixed(1)} goals/min`;
  }

  function evaluateGoal() {
    const before = run.goalIndex;
    checkGoal(run, {
      cursor: cm.getCursor(),
      text: cm.getValue(),
      mode: currentMode,
    }, performance.now());
    if (run.goalIndex !== before && !run.completedAt) {
      const goal = currentGoal(run);
      if (goal.type === "cursor" || goal.type === "mode") showGoal();
      else prepareGoal();
    }
    else if (run.completedAt) clearMarks();
    queueGuide();
    draw();
  }

  CodeMirror.on(cm, "vim-keypress", key => {
    if (preparing) return;
    const before = run.startedAt;
    recordKey(run, normalizeVimKey(key), performance.now());
    if (before === null && run.startedAt !== null) startTimer();
    setTimeout(evaluateGoal, 20);
    draw();
  });

  CodeMirror.on(cm, "vim-mode-change", modeObj => {
    if (preparing) return;
    currentMode = normalizeMode(modeObj);
    setTimeout(evaluateGoal, 20);
    draw();
  });

  cm.on("cursorActivity", queueGuide);
  cm.on("scroll", queueGuide);
  window.addEventListener("resize", queueGuide);

  cm.getWrapperElement().addEventListener("mousedown", event => {
    event.preventDefault();
    cm.focus();
  }, true);

  nav.addEventListener("click", event => {
    const button = event.target.closest("button[data-index]");
    if (!button) return;
    run = createRun(Number(button.dataset.index));
    resetDemo();
    prepareGoal();
    cm.focus();
  });

  playDemo.addEventListener("click", playTutorial);

  document.querySelector("#reset").addEventListener("click", () => {
    run = createRun(run.lessonIndex);
    resetDemo();
    prepareGoal();
    cm.focus();
  });

  document.querySelector("#next").addEventListener("click", () => {
    run = createRun((run.lessonIndex + 1) % lessons.length);
    resetDemo();
    prepareGoal();
    cm.focus();
  });

  prepareGoal();
  cm.focus();

  function markGoal(goal) {
    const insertAt = insertionPoint(goal);
    if (insertAt) {
      const widget = document.createElement("span");
      widget.className = "cm-insert-target";
      marks.push(cm.setBookmark(insertAt, { widget }));
      return;
    }
    if (goal.range) {
      marks.push(cm.markText(goal.range.from, goal.range.to, { className: "cm-edit-target" }));
      return;
    }
    const at = goal.at || goal.start;
    if (!at) return;
    const line = cm.getLine(at.line) || "";
    if (at.ch < line.length) marks.push(cm.markText(at, { line: at.line, ch: at.ch + 1 }, { className: "cm-target" }));
    else {
      const widget = document.createElement("span");
      widget.className = "cm-target target-bookmark";
      widget.textContent = " ";
      marks.push(cm.setBookmark(at, { widget }));
    }
  }

  function clearMarks() {
    marks.forEach(mark => mark.clear());
    marks = [];
    visualGuide.replaceChildren();
  }

  function queueGuide() {
    requestAnimationFrame(drawGuide);
  }

  function drawGuide() {
    const goal = currentGoal(run);
    visualGuide.replaceChildren();
    if (!goal || run.completedAt) return;
    const from = pointFor(cm.getCursor());
    const to = pointFor(insertionPoint(goal) || goal.range?.to || goal.at || goal.start);
    if (!from || !to) return;
    addSvg("line", { x1: from.x, y1: from.y, x2: to.x, y2: to.y });
  }

  function pointFor(pos) {
    if (!pos) return null;
    const box = cm.charCoords(pos, "page");
    const wrap = visualGuide.getBoundingClientRect();
    return {
      x: box.left - window.scrollX - wrap.left,
      y: ((box.top + box.bottom) / 2) - window.scrollY - wrap.top,
    };
  }

  function addSvg(name, attrs) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", name);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    visualGuide.append(node);
    return node;
  }

  function objectiveText(goal) {
    if (goal.type === "cursor") return "Objective: move your cursor onto the green target.";
    if (goal.type === "mode" && goal.mode === "INSERT") return "Objective: enter INSERT mode at the cursor. Do not type text for this goal.";
    if (goal.type === "mode" && goal.mode === "NORMAL") return "Objective: leave insert or visual mode and return to NORMAL mode.";
    if (goal.type === "mode") return `Objective: switch Vim to ${goal.mode} mode.`;
    if (goal.insertText) {
      const task = goal.hint ? `${goal.hint} ` : "";
      return `Objective: ${task}Type ${visibleText(goal.insertText)} ${placementText(goal) || "for this fix"}, then press Esc.`;
    }
    if (goal.excludes?.length) return `Objective: ${goal.hint || `remove "${goal.excludes[0]}" from the editor.`}`;
    return goal.hint ? `Objective: ${goal.hint}` : "Objective: edit the highlighted text.";
  }

  function showDemoKey(key) {
    demoKey.textContent = key;
    demoKey.classList.toggle("show", Boolean(key));
  }
}

function sendDemoStep(cm, step) {
  if (step.target === "insert" && step.key.length === 1 && cm.state.vim?.insertMode) {
    cm.replaceSelection(step.key);
    return;
  }
  if (step.target === "search") {
    const input = cm.getWrapperElement().querySelector(".CodeMirror-dialog input");
    if (input) {
      input.value += step.key;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }
  }
  CodeMirror.Vim.handleKey(cm, toVimKey(step.key), "user");
}

function normalizeMode(modeObj) {
  const mode = String(modeObj.mode || "normal").toUpperCase();
  const sub = String(modeObj.subMode || "").toLowerCase();
  const subMode = sub === "linewise" ? " LINE" : sub === "blockwise" ? " BLOCK" : sub ? ` ${sub.toUpperCase()}` : "";
  return `${mode}${subMode}`;
}

function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function escapeHtml(textValue) {
  return String(textValue).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char]));
}

function shortKey(key) {
  return String(key).replaceAll("Esc", "esc").replaceAll("Enter", "ret");
}

if (typeof document !== "undefined") mount();
