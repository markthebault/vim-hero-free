export const groups = [
  ["Basic Vim", [
    ["Intro to modes", ["i", "Esc"]],
    ["Basic Movement", ["h", "j", "k", "l"]],
    ["Moving by Words", ["w", "e", "b"]],
    ["Insert Mode", ["i", "a", "Esc"]],
  ]],
  ["Insert Like a Pro", [
    ["Insert at Line Ends", ["I", "A", "Esc"]],
    ["Opening New Lines", ["o", "O"]],
    ["Making Small Edits", ["s", "x", "r"]],
  ]],
  ["Essential Motions", [
    ["Moving by WORDs", ["W", "E", "B"]],
    ["Moving to Line Ends", ["0", "_", "$"]],
    ["Find Character", ["f", "F", ";"]],
    ["Till Character", ["t", "T", ";"]],
  ]],
  ["Basic Operators", [
    ["Intro to Operators", ["d", "c", "y"]],
    ["Delete Words", ["dw"]],
    ["Change Words", ["cw"]],
    ["Delete Lines", ["dd", "D"]],
    ["Delete Multiple Lines", ["dj", "dk"]],
    ["Copy/Paste Lines", ["yy", "p", "P"]],
  ]],
  ["Advanced Vertical Movement", [
    ["Relative Line Jumps", ["3j", "3k"]],
    ["Absolute Line Jumps", ["gg", "G"]],
    ["Paragraph Jumps", ["}", "{"]],
    ["Window Scrolls", ["Ctrl+u", "Ctrl+d"]],
  ]],
  ["Search", [
    ["Search", ["/", "?"]],
    ["Repeat Search", ["n", "N"]],
    ["Quick Word Search", ["*", "#"]],
    ["Search Review", ["/", "n", "N", "*"]],
  ]],
  ["Text Objects - Bracket Pairs", [
    ["Intro to Text Objects", ["iw", "aw"]],
    ["Delete Inside Brackets", ["di{"]],
    ["Delete Around Brackets", ["da{"]],
    ["Change Inside Brackets", ["ci{"]],
    ["Change Around Brackets", ["ca{"]],
    ["Brackets Review", ["di{", "ca{"]],
  ]],
  ["Text Objects - Quotes", [
    ["Delete Inside Quotes", ["di\""]],
    ["Delete Around Quotes", ["da\""]],
    ["Change Inside Quotes", ["ci\""]],
    ["Change Around Quotes", ["ca\""]],
    ["Quotes Review", ["di\"", "ca\""]],
  ]],
  ["Text Objects - Words", [
    ["Delete Inside Word", ["diw"]],
    ["Delete Around Word", ["daw"]],
    ["Change Inside Word", ["ciw"]],
    ["Words Review", ["diw", "daw", "ciw"]],
  ]],
  ["Text Objects - Paragraphs", [
    ["Delete Inside Paragraph", ["dip"]],
    ["Delete Around Paragraph", ["dap"]],
    ["Change Inside Paragraph", ["cip"]],
    ["Paragraphs Review", ["dip", "dap", "cip"]],
  ]],
  ["Text Objects - Mega Review", [
    ["Text Objects Mega Review", ["di{", "ci\"", "daw", "dap"]],
  ]],
  ["Visual Mode", [
    ["Intro to Visual Mode", ["v", "Esc"]],
    ["Visual Mode Operators", ["d", "c", "y"]],
    ["Switch Selection Ends", ["v", "o"]],
    ["Visual Line Mode", ["V", "Esc"]],
    ["Switch Visual Line Ends", ["V", "o"]],
    ["Visual Line Operators", ["Vd", "Vy"]],
  ]],
];

export const lessons = groups.flatMap(([group, items]) =>
  items.map(([title, keys], index) => ({ group, title, keys, id: slug(group, title, index) }))
);

const sample = [
  "function setGreeting(greeting) {",
  "  const element = document.getElementById('greeting');",
  "  element.innerText = greeting;",
  "}",
  "",
  "setGreeting('Hello World!');",
];

export function slug(group, title, index) {
  return `${group}-${title}-${index}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function createState(lessonIndex = 0) {
  return {
    lines: [...sample],
    row: 0,
    col: 0,
    mode: "NORMAL",
    lessonIndex,
    step: 0,
    input: "",
    message: "Focus the editor and press the highlighted Vim command.",
    done: new Set(JSON.parse(localStorage.getItem("doneLessons") || "[]")),
    lastFind: null,
    lastSearch: null,
    visual: null,
    register: "",
  };
}

export function wanted(state) {
  return lessons[state.lessonIndex].keys[state.step % lessons[state.lessonIndex].keys.length];
}

export function keyName(event) {
  if (event.key === "Escape") return "Esc";
  if (event.ctrlKey && event.key.length === 1) return `Ctrl+${event.key.toLowerCase()}`;
  if (event.key === "Enter") return "Enter";
  if (event.key.length === 1) return event.key;
  return "";
}

export function feed(state, key) {
  if (!key) return state;
  if (key === "Esc") {
    state.mode = "NORMAL";
    state.input = "";
    state.visual = null;
    if (wanted(state) === "Esc") passStep(state);
  } else if (state.mode === "INSERT") {
    state.lines[state.row] = insertAt(line(state), state.col, key);
    state.col += key.length;
  } else {
    state.input += key;
    const target = wanted(state);
    if (!target.startsWith(state.input)) {
      state.input = key;
    }
    if (state.input === target) {
      applyCommand(state, target);
      passStep(state);
    }
  }
  clampCursor(state);
  return state;
}

export function applyCommand(state, cmd) {
  const n = parseInt(cmd, 10) || 1;
  const raw = cmd.replace(/^\d+/, "");
  if (raw === "h") state.col -= n;
  if (raw === "l") state.col += n;
  if (raw === "j") state.row += n;
  if (raw === "k") state.row -= n;
  if (raw === "w" || raw === "W") nextWord(state, false);
  if (raw === "e" || raw === "E") nextWord(state, true);
  if (raw === "b" || raw === "B") prevWord(state);
  if (raw === "0") state.col = 0;
  if (raw === "_") state.col = firstTextCol(line(state));
  if (raw === "$") state.col = Math.max(0, line(state).length - 1);
  if (raw === "gg") state.row = 0;
  if (raw === "G") state.row = state.lines.length - 1;
  if (raw === "}") state.row = nextBlank(state);
  if (raw === "{") state.row = prevBlank(state);
  if (raw === "Ctrl+d") state.row += 3;
  if (raw === "Ctrl+u") state.row -= 3;
  if (raw === "i") state.mode = "INSERT";
  if (raw === "a") { state.col += 1; state.mode = "INSERT"; }
  if (raw === "I") { state.col = firstTextCol(line(state)); state.mode = "INSERT"; }
  if (raw === "A") { state.col = line(state).length; state.mode = "INSERT"; }
  if ((raw === "o" || raw === "O") && !state.visual) openLine(state, raw === "O");
  if (raw === "x") deleteRange(state, state.row, state.col, state.row, state.col + 1);
  if (raw === "s") { deleteRange(state, state.row, state.col, state.row, state.col + 1); state.mode = "INSERT"; }
  if (raw === "r") replaceChar(state, "R");
  if (raw === "dd" || raw === "dj" || raw === "dk") deleteLine(state, raw);
  if (raw === "D") deleteRange(state, state.row, state.col, state.row, line(state).length);
  if (raw === "dw" || raw === "cw") wordEdit(state, raw === "cw");
  if (raw === "yy") state.register = line(state);
  if (raw === "p" || raw === "P") pasteLine(state, raw === "P");
  if (raw === "v" || raw === "V") state.visual = state.visual ? null : { row: state.row, col: state.col, line: raw === "V" };
  if (raw === "o" && state.visual) [state.row, state.visual.row] = [state.visual.row, state.row];
  if (raw === "Vd" || raw === "Vy") { if (raw === "Vd") deleteLine(state, "dd"); state.visual = null; }
  if (/^[dcy][ia][{"wp]$/.test(raw)) textObject(state, raw);
  if (raw === "/" || raw === "?") search(state, "greeting", raw === "?");
  if (raw === "n" || raw === "N") repeatSearch(state, raw === "N");
  if (raw === "*" || raw === "#") search(state, wordUnderCursor(state), raw === "#");
  if (raw === "f" || raw === "t") findChar(state, "e", raw === "t" ? -1 : 0);
  if (raw === "F" || raw === "T") findCharBack(state, "e", raw === "T" ? 1 : 0);
  if (raw === ";") repeatFind(state);
}

function passStep(state) {
  state.input = "";
  state.step += 1;
  const lesson = lessons[state.lessonIndex];
  if (state.step >= lesson.keys.length) {
    state.done.add(lesson.id);
    localStorage.setItem("doneLessons", JSON.stringify([...state.done]));
    state.message = "Lesson complete.";
  } else {
    state.message = "Good. Keep going.";
  }
}

function line(state) {
  return state.lines[state.row] || "";
}

function clampCursor(state) {
  state.row = Math.max(0, Math.min(state.row, state.lines.length - 1));
  state.col = Math.max(0, Math.min(state.col, Math.max(0, line(state).length - 1)));
}

function insertAt(text, col, value) {
  return text.slice(0, col) + value + text.slice(col);
}

function firstTextCol(text) {
  const match = /\S/.exec(text);
  return match ? match.index : 0;
}

function positions(state) {
  const out = [];
  state.lines.forEach((text, row) => {
    for (const match of text.matchAll(/[A-Za-z0-9_]+|[^A-Za-z0-9_\s]+/g)) {
      out.push({ row, start: match.index, end: match.index + match[0].length - 1 });
    }
  });
  return out;
}

function nextWord(state, end) {
  const hit = positions(state).find(pos => pos.row > state.row || (pos.row === state.row && pos.start > state.col));
  if (hit) { state.row = hit.row; state.col = end ? hit.end : hit.start; }
}

function prevWord(state) {
  const all = positions(state);
  const hit = all.filter(pos => pos.row < state.row || (pos.row === state.row && pos.start < state.col)).pop();
  if (hit) { state.row = hit.row; state.col = hit.start; }
}

function nextBlank(state) {
  const found = state.lines.findIndex((text, index) => index > state.row && !text.trim());
  return found === -1 ? state.lines.length - 1 : found;
}

function prevBlank(state) {
  for (let row = state.row - 1; row >= 0; row -= 1) if (!state.lines[row].trim()) return row;
  return 0;
}

function openLine(state, above) {
  state.lines.splice(state.row + (above ? 0 : 1), 0, "");
  state.row += above ? 0 : 1;
  state.col = 0;
  state.mode = "INSERT";
}

function deleteRange(state, row, from, toRow, to) {
  if (row !== toRow) return;
  state.lines[row] = state.lines[row].slice(0, from) + state.lines[row].slice(to);
}

function replaceChar(state, char) {
  const text = line(state);
  state.lines[state.row] = text.slice(0, state.col) + char + text.slice(state.col + 1);
}

function deleteLine(state, cmd) {
  const count = cmd === "dd" ? 1 : 2;
  const start = cmd === "dk" ? Math.max(0, state.row - 1) : state.row;
  state.register = state.lines.slice(start, start + count).join("\n");
  state.lines.splice(start, count);
  if (!state.lines.length) state.lines.push("");
  state.row = start;
}

function wordEdit(state, insert) {
  const text = line(state);
  const rest = text.slice(state.col);
  const match = rest.match(/^\W*\w+/);
  if (match) deleteRange(state, state.row, state.col, state.row, state.col + match[0].length);
  if (insert) state.mode = "INSERT";
}

function pasteLine(state, above) {
  state.lines.splice(state.row + (above ? 0 : 1), 0, state.register || "pasted_line();");
  if (!above) state.row += 1;
}

function textObject(state, cmd) {
  const change = cmd[0] === "c";
  const del = cmd[0] === "d" || change;
  if (del) wordEdit(state, change);
  if (cmd[0] === "y") state.register = wordUnderCursor(state);
}

function search(state, needle, reverse = false) {
  state.lastSearch = { needle, reverse };
  repeatSearch(state, false);
}

function repeatSearch(state, flip) {
  if (!state.lastSearch) return;
  const reverse = flip ? !state.lastSearch.reverse : state.lastSearch.reverse;
  const rows = reverse ? [...state.lines.keys()].reverse() : [...state.lines.keys()];
  for (const row of rows) {
    if (reverse && row > state.row) continue;
    if (!reverse && row < state.row) continue;
    const col = reverse ? state.lines[row].lastIndexOf(state.lastSearch.needle) : state.lines[row].indexOf(state.lastSearch.needle);
    if (col !== -1 && (row !== state.row || col !== state.col)) {
      state.row = row;
      state.col = col;
      return;
    }
  }
}

function wordUnderCursor(state) {
  const text = line(state);
  const hit = [...text.matchAll(/\w+/g)].find(match => state.col >= match.index && state.col < match.index + match[0].length);
  return hit ? hit[0] : "greeting";
}

function findChar(state, char, offset) {
  const col = line(state).indexOf(char, state.col + 1);
  if (col !== -1) {
    state.lastFind = { char, reverse: false, offset };
    state.col = col + offset;
  }
}

function findCharBack(state, char, offset) {
  const col = line(state).lastIndexOf(char, state.col - 1);
  if (col !== -1) {
    state.lastFind = { char, reverse: true, offset };
    state.col = col + offset;
  }
}

function repeatFind(state) {
  if (!state.lastFind) return;
  if (state.lastFind.reverse) findCharBack(state, state.lastFind.char, state.lastFind.offset);
  else findChar(state, state.lastFind.char, state.lastFind.offset);
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char]));
}

export function renderCode(state) {
  return state.lines.map((text, row) => {
    const chars = text || " ";
    const code = [...chars].map((char, col) => {
      const cursor = row === state.row && col === state.col;
      const visual = state.visual && row === state.row && col >= Math.min(state.visual.col, state.col) && col <= Math.max(state.visual.col, state.col);
      const classes = [cursor ? "cursor" : "", visual ? "visual" : ""].filter(Boolean).join(" ");
      return classes ? `<span class="${classes}">${escapeHtml(char)}</span>` : escapeHtml(char);
    }).join("");
    return `<div class="row"><span class="ln">${row + 1}</span><span class="code">${code}</span></div>`;
  }).join("");
}

function mount() {
  const nav = document.querySelector("#nav");
  const title = document.querySelector("#title");
  const summary = document.querySelector("#summary");
  const commands = document.querySelector("#commands");
  const editor = document.querySelector("#editor");
  const mode = document.querySelector("#mode");
  const target = document.querySelector("#target");
  const toast = document.querySelector("#toast");
  let state = createState();

  function drawNav() {
    nav.innerHTML = groups.map(([group, items]) => {
      const links = items.map(([name]) => {
        const index = lessons.findIndex(lesson => lesson.group === group && lesson.title === name);
        const lesson = lessons[index];
        const active = index === state.lessonIndex ? " active" : "";
        const done = state.done.has(lesson.id) ? " done" : "";
        return `<button class="lesson-btn${active}${done}" data-index="${index}" type="button">${escapeHtml(name)}</button>`;
      }).join("");
      return `<div class="group-title">${escapeHtml(group)}</div>${links}`;
    }).join("");
  }

  function draw() {
    const lesson = lessons[state.lessonIndex];
    title.textContent = lesson.title;
    summary.textContent = `${lesson.group}. Complete each command in order.`;
    commands.innerHTML = lesson.keys.map((key, index) => `<kbd>${escapeHtml(key)}</kbd>${index === state.step ? "" : ""}`).join("");
    editor.innerHTML = renderCode(state);
    mode.textContent = state.mode;
    target.textContent = state.step >= lesson.keys.length ? "done" : `press ${wanted(state)}`;
    toast.textContent = state.message;
    toast.className = `toast ${state.message.includes("complete") ? "ok" : "muted"}`;
    drawNav();
  }

  nav.addEventListener("click", event => {
    const button = event.target.closest("button[data-index]");
    if (!button) return;
    state = createState(Number(button.dataset.index));
    draw();
    editor.focus();
  });

  editor.addEventListener("keydown", event => {
    const key = keyName(event);
    if (!key) return;
    event.preventDefault();
    feed(state, key);
    draw();
  });

  document.querySelector("#reset").addEventListener("click", () => {
    state = createState(state.lessonIndex);
    draw();
    editor.focus();
  });

  document.querySelector("#next").addEventListener("click", () => {
    state = createState((state.lessonIndex + 1) % lessons.length);
    draw();
    editor.focus();
  });

  draw();
  editor.focus();
}

if (typeof document !== "undefined") mount();
