<%*
/* SPLIT SCRIPT v3.0 */
try {
    // We use tp.obsidian to avoid the "not defined" error
    const { MarkdownView, Notice } = tp.obsidian;
    
    const activeView = app.workspace.getActiveViewOfType(MarkdownView);
    if (!activeView) {
        new Notice("Error: No active Markdown editor found.");
        return;
    }

    const editor = activeView.editor;
    const cursor = editor.getCursor();
    const currentFile = activeView.file;

    // 1. Get content from cursor to the absolute end
    const lastLine = editor.lineCount() - 1;
    const lastLineContent = editor.getLine(lastLine);
    const contentToMove = editor.getRange(cursor, { line: lastLine, ch: lastLineContent.length });

    if (!contentToMove || contentToMove.trim().length === 0) {
        new Notice("Nothing to split below the cursor!");
        return;
    }

    // 2. Generate a safe filename (using hyphens for time to please Android)
    const timestamp = tp.date.now("HH-mm-ss");
    const newFileName = `${currentFile.basename} (Split ${timestamp})`;
    const folderPath = currentFile.parent.path;
    const newPath = folderPath === "/" ? `${newFileName}.md` : `${folderPath}/${newFileName}.md`;

    // 3. Create the new file
    const newFile = await app.vault.create(newPath, contentToMove);

    // 4. Delete the moved text from the original file
    editor.replaceRange("", cursor, { line: lastLine, ch: lastLineContent.length });

    // 5. Open in a new tab
    const newLeaf = app.workspace.getLeaf('tab');
    await newLeaf.openFile(newFile);
    
    new Notice(`Split into: ${newFileName}`);

} catch (err) {
    console.error(err);
    new tp.obsidian.Notice("Split failed. Check console.");
}
%>