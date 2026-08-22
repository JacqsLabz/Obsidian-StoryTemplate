<%*
const editor = app.workspace.activeEditor.editor;
const cursor = editor.getCursor();
let line = cursor.line;

// Find the start of the paragraph
let start = line;
while (start > 0 && editor.getLine(start - 1).trim() !== "") {
  start--;
}

// Find the end of the paragraph
let end = line;
while (end < editor.lineCount() - 1 && editor.getLine(end + 1).trim() !== "") {
  end++;
}

// Get the paragraph lines
let paragraph = [];
for (let i = start; i <= end; i++) {
  paragraph.push(editor.getLine(i));
}

// Wrap the paragraph in %%
const commented = ["%%", ...paragraph, "%%"].join("\n");

// Replace the paragraph in the editor
editor.replaceRange(commented, { line: start, ch: 0 }, { line: end + 1, ch: 0 });
%>