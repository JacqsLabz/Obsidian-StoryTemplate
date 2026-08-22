<%*
const editor = app.workspace.activeEditor.editor;

let from = editor.getCursor("from");
let to = editor.getCursor("to");
const hasSelection = from.line !== to.line || from.ch !== to.ch;

let startLine = from.line;
let endLine = to.line;

// === Case 1: No selection ===
if (!hasSelection) {
  const lineNum = from.line;
  let text = editor.getLine(lineNum);
  let trimmed = text.trim();

  if (trimmed === "") {
    // Empty line: insert %% before and after cursor, move cursor to middle
    const cursor = editor.getCursor();
    editor.replaceRange("%% ", cursor);
    editor.replaceRange(" %%", { line: cursor.line, ch: cursor.ch + 3 });
    editor.setCursor({ line: cursor.line, ch: cursor.ch + 3 }); // Move cursor between %%
  } else {
    const startsWithComment = trimmed.startsWith("%%");
    const endsWithComment = trimmed.endsWith("%%");

    if (startsWithComment && endsWithComment) {
      text = text.replace(/^(\s*)%%\s*/, "$1").replace(/\s*%%(\s*)$/, "$1");
    } else if (startsWithComment && !endsWithComment) {
      text = text + " %%";
    } else if (!startsWithComment && endsWithComment) {
      text = "%% " + text;
    } else {
      text = "%% " + text + " %%";
    }

    editor.setLine(lineNum, text);
  }

// === Case 2: Multi-line selection ===
} else {
  // Recalculate actual selection text in case the content changed
  let lines = [];
  for (let i = startLine; i <= endLine; i++) {
    lines.push(editor.getLine(i));
  }

  let updated = lines.map((line) => {
    const trimmed = line.trim();

    if (trimmed === "") {
      // Leave blank lines unchanged in multiline
      return line;
    }

    const startsWithComment = trimmed.startsWith("%%");
    const endsWithComment = trimmed.endsWith("%%");

    if (startsWithComment && endsWithComment) {
      return line.replace(/^(\s*)%%\s*/, "$1").replace(/\s*%%(\s*)$/, "$1");
    } else if (startsWithComment && !endsWithComment) {
      return line + " %%";
    } else if (!startsWithComment && endsWithComment) {
      return "%% " + line;
    } else {
      return "%% " + line + " %%";
    }
  });

  const newText = updated.join("\n");

  // Replace precisely the selected lines' full content
  const fromPos = { line: startLine, ch: 0 };
  const toPos = { line: endLine, ch: editor.getLine(endLine).length };
  editor.replaceRange(newText, fromPos, toPos);
}
%>