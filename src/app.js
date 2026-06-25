const sample = `function setGreeting(greeting) {
  const element = document.getElementById('greeting');
  element.innerText = greeting;
}

setGreeting('Hello World!');`;

export const groups = [
  ["Basic Vim", [
    ["Intro to modes", ["i", "Esc"]],
    ["Basic Movement", ["h", "j", "k", "l"]],
    ["Moving by Words", ["w", "e", "b"]],
    ["Insert Mode", ["i", "Esc", "a", "Esc"]],
  ]],
  ["Insert Like a Pro", [
    ["Insert at Line Ends", ["I", "Esc", "A", "Esc"]],
    ["Opening New Lines", ["o", "Esc", "O", "Esc"]],
    ["Making Small Edits", ["s", "Esc", "x", "rR"]],
  ]],
  ["Essential Motions", [
    ["Moving by WORDs", ["W", "E", "B"]],
    ["Moving to Line Ends", ["0", "_", "$"]],
    ["Find Character", ["fe", "Fe", ";"]],
    ["Till Character", ["te", "Te", ";"]],
  ]],
  ["Basic Operators", [
    ["Intro to Operators", ["dw", "cw", "yy"]],
    ["Delete Words", ["dw"]],
    ["Change Words", ["cw", "Esc"]],
    ["Delete Lines", ["dd", "D"]],
    ["Delete Multiple Lines", ["dj", "dk"]],
    ["Copy/Paste Lines", ["yy", "p", "P"]],
  ]],
  ["Advanced Vertical Movement", [
    ["Relative Line Jumps", ["3j", "3k"]],
    ["Absolute Line Jumps", ["gg", "G"]],
    ["Paragraph Jumps", ["}", "{"]],
    ["Window Scrolls", ["Ctrl+d", "Ctrl+u"]],
  ]],
  ["Search", [
    ["Search", ["/greeting Enter", "?greeting Enter"]],
    ["Repeat Search", ["n", "N"]],
    ["Quick Word Search", ["*", "#"]],
    ["Search Review", ["/greeting Enter", "n", "N", "*"]],
  ]],
  ["Text Objects - Bracket Pairs", [
    ["Intro to Text Objects", ["diw", "u"]],
    ["Delete Inside Brackets", ["di{"]],
    ["Delete Around Brackets", ["da{"]],
    ["Change Inside Brackets", ["ci{", "Esc"]],
    ["Change Around Brackets", ["ca{", "Esc"]],
    ["Brackets Review", ["di{", "u", "ca{", "Esc"]],
  ]],
  ["Text Objects - Quotes", [
    ["Delete Inside Quotes", ["di'"]],
    ["Delete Around Quotes", ["da'"]],
    ["Change Inside Quotes", ["ci'", "Esc"]],
    ["Change Around Quotes", ["ca'", "Esc"]],
    ["Quotes Review", ["di'", "u", "ca'", "Esc"]],
  ]],
  ["Text Objects - Words", [
    ["Delete Inside Word", ["diw"]],
    ["Delete Around Word", ["daw"]],
    ["Change Inside Word", ["ciw", "Esc"]],
    ["Words Review", ["diw", "u", "daw", "u", "ciw", "Esc"]],
  ]],
  ["Text Objects - Paragraphs", [
    ["Delete Inside Paragraph", ["dip"]],
    ["Delete Around Paragraph", ["dap"]],
    ["Change Inside Paragraph", ["cip", "Esc"]],
    ["Paragraphs Review", ["dip", "u", "dap", "u", "cip", "Esc"]],
  ]],
  ["Text Objects - Mega Review", [
    ["Text Objects Mega Review", ["di{", "u", "ci'", "Esc", "daw", "u", "dap", "u"]],
  ]],
  ["Visual Mode", [
    ["Intro to Visual Mode", ["v", "Esc"]],
    ["Visual Mode Operators", ["vwd", "u", "vwy"]],
    ["Switch Selection Ends", ["vw", "o", "Esc"]],
    ["Visual Line Mode", ["V", "Esc"]],
    ["Switch Visual Line Ends", ["V", "o", "Esc"]],
    ["Visual Line Operators", ["Vd", "u", "Vy"]],
  ]],
];

export const lessons = groups.flatMap(([group, items]) =>
  items.map(([title, keys], index) => ({ group, title, keys, id: slug(group, title, index) }))
);

export function slug(group, title, index) {
  return `${group}-${title}-${index}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function createState(lessonIndex = 0) {
  return {
    lessonIndex,
    step: 0,
    input: [],
    message: "Focus the editor and press the highlighted Vim command.",
    done: new Set(JSON.parse(globalThis.localStorage?.getItem("doneLessons") || "[]")),
  };
}

export function wanted(state) {
  return lessons[state.lessonIndex].keys[state.step % lessons[state.lessonIndex].keys.length];
}

export function tokens(command) {
  const out = [];
  for (const part of command.split(" ")) {
    if (part === "Esc" || part === "Enter" || part.startsWith("Ctrl+")) out.push(part);
    else out.push(...part);
  }
  return out;
}

export function track(state, vimKey) {
  const target = tokens(wanted(state));
  state.input.push(vimKey);
  if (!startsWith(target, state.input)) state.input = [vimKey];
  if (same(target, state.input)) passStep(state);
  return state;
}

function startsWith(target, input) {
  return input.every((key, index) => key === target[index]);
}

function same(a, b) {
  return a.length === b.length && startsWith(a, b);
}

function passStep(state) {
  state.input = [];
  state.step += 1;
  const lesson = lessons[state.lessonIndex];
  if (state.step >= lesson.keys.length) {
    state.done.add(lesson.id);
    globalThis.localStorage?.setItem("doneLessons", JSON.stringify([...state.done]));
    state.message = "Lesson complete.";
  } else {
    state.message = "Good. Keep going.";
  }
}

function mount() {
  const nav = document.querySelector("#nav");
  const title = document.querySelector("#title");
  const summary = document.querySelector("#summary");
  const commands = document.querySelector("#commands");
  const tutorialTitle = document.querySelector("#tutorial-title");
  const tutorialStatus = document.querySelector("#tutorial-status");
  const playDemo = document.querySelector("#play-demo");
  const mode = document.querySelector("#mode");
  const target = document.querySelector("#target");
  const toast = document.querySelector("#toast");
  const editorEl = document.querySelector("#editor");
  const demoEl = document.querySelector("#demo-editor");
  let state = createState();
  let demoTimers = [];
  const cm = CodeMirror.fromTextArea(editorEl, {
    value: sample,
    mode: "javascript",
    theme: "material-darker",
    keyMap: "vim",
    lineNumbers: true,
    indentUnit: 2,
    tabSize: 2,
  });
  const demoCm = CodeMirror.fromTextArea(demoEl, {
    value: sample,
    mode: "javascript",
    theme: "material-darker",
    keyMap: "vim",
    lineNumbers: true,
    indentUnit: 2,
    tabSize: 2,
  });

  function resetEditor() {
    cm.setValue(sample);
    cm.setCursor({ line: 0, ch: 0 });
    CodeMirror.Vim.exitInsertMode(cm);
  }

  function resetDemo() {
    demoTimers.forEach(clearTimeout);
    demoTimers = [];
    demoCm.setValue(sample);
    demoCm.setCursor({ line: 0, ch: 0 });
    CodeMirror.Vim.exitInsertMode(demoCm);
    tutorialStatus.textContent = "paused";
    playDemo.textContent = "Play";
  }

  function playTutorial() {
    resetDemo();
    const keys = demoTokens(lessons[state.lessonIndex]);
    tutorialStatus.textContent = "playing";
    playDemo.textContent = "Replay";
    demoCm.focus();
    keys.forEach((key, index) => {
      demoTimers.push(setTimeout(() => {
        demoCm.focus();
        sendDemoKey(demoCm, key);
        tutorialStatus.textContent = `input: ${key}`;
        if (index === keys.length - 1) tutorialStatus.textContent = "finished";
      }, 900 * (index + 1)));
    });
  }

  function drawNav() {
    nav.innerHTML = groups.map(([group, items]) => {
      const links = items.map(([name]) => {
        const index = lessons.findIndex(lesson => lesson.group === group && lesson.title === name);
        const lesson = lessons[index];
        const active = index === state.lessonIndex ? " active" : "";
        const done = state.done.has(lesson.id) ? " done" : "";
        const keys = lesson.keys.slice(0, 4).map(key => `<span class="mini-kbd">${escapeHtml(shortKey(key))}</span>`).join("");
        return `<button class="lesson-btn${active}${done}" data-index="${index}" type="button"><span class="lesson-name">${escapeHtml(name)}</span><span class="lesson-keys" aria-label="Shortcuts">${keys}</span></button>`;
      }).join("");
      return `<div class="group-title">${escapeHtml(group)}</div>${links}`;
    }).join("");
  }

  function draw() {
    const lesson = lessons[state.lessonIndex];
    title.textContent = lesson.title;
    summary.textContent = `${lesson.group}. The editor is CodeMirror Vim mode; commands are handled by its Vim keymap.`;
    commands.innerHTML = lesson.keys.map((key, index) => `<kbd>${escapeHtml(key)}</kbd>`).join("");
    tutorialTitle.textContent = `${lesson.title} example`;
    target.textContent = state.step >= lesson.keys.length ? "done" : `press ${wanted(state)}`;
    toast.textContent = state.message;
    toast.className = `toast ${state.message.includes("complete") ? "ok" : "muted"}`;
    drawNav();
  }

  CodeMirror.on(cm, "vim-keypress", key => {
    track(state, normalizeVimKey(key));
    draw();
  });

  CodeMirror.on(cm, "vim-mode-change", modeObj => {
    mode.textContent = modeObj.mode.toUpperCase() + (modeObj.subMode ? ` ${modeObj.subMode.toUpperCase()}` : "");
  });

  nav.addEventListener("click", event => {
    const button = event.target.closest("button[data-index]");
    if (!button) return;
    state = createState(Number(button.dataset.index));
    resetEditor();
    resetDemo();
    draw();
    cm.focus();
  });

  playDemo.addEventListener("click", playTutorial);

  document.querySelector("#reset").addEventListener("click", () => {
    state = createState(state.lessonIndex);
    resetEditor();
    resetDemo();
    draw();
    cm.focus();
  });

  document.querySelector("#next").addEventListener("click", () => {
    state = createState((state.lessonIndex + 1) % lessons.length);
    resetEditor();
    resetDemo();
    draw();
    cm.focus();
  });

  draw();
  cm.focus();
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char]));
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

export function demoTokens(lesson) {
  const out = [];
  let needsText = false;
  for (const command of lesson.keys) {
    for (const key of tokens(command)) {
      if (key === "Esc" && needsText) {
        out.push(...tokens("demo"));
        needsText = false;
      }
      out.push(key);
    }
    needsText = leavesInsertModeOpen(command) || needsText;
  }
  return out;
}

function leavesInsertModeOpen(command) {
  return /^(i|a|I|A|o|O|s|c.|ci.|ca.|cip|ciw)$/.test(command);
}

function sendDemoKey(cm, key) {
  if (key.length === 1 && cm.state.vim?.insertMode) cm.replaceSelection(key);
  else CodeMirror.Vim.handleKey(cm, toVimKey(key), "user");
}

function shortKey(key) {
  return key.replaceAll("Esc", "esc").replaceAll("Enter", "ret");
}

if (typeof document !== "undefined") mount();
