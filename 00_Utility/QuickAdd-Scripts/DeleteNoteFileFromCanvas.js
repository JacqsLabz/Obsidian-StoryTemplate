module.exports = async (params) => {
    // 1. Get the current active view via the workspace
    const activeView = app.workspace.getActiveViewOfType(Object);
    
    // 2. Check if the view exists and its type is specifically 'canvas'
    // We use window.Notice to avoid "obsidian is not defined"
    if (!activeView || activeView.getViewType() !== "canvas") {
        new window.Notice("Focus the Canvas tab first!");
        return;
    }

    // 3. Get the selection from the canvas
    const canvas = activeView.canvas;
    const selection = canvas.selection;

    if (!selection || selection.size === 0) {
        new window.Notice("Select a card on the canvas first!");
        return;
    }

    // 4. Process the deletion
    const selectedNodes = Array.from(selection);
    
    for (const node of selectedNodes) {
        // If the card points to a file (Markdown, Image, etc.)
        if (node.file) {
            const file = node.file;
            
            // Move file to System Trash
            await app.vault.trash(file, true); 
            
            // Remove the card from the Canvas board
            canvas.removeNode(node);
            new window.Notice(`Deleted: ${file.name}`);
        } else {
            // Just remove the card (text, group, etc.)
            canvas.removeNode(node);
            new window.Notice("Removed card from canvas.");
        }
    }

    // 5. Save the canvas state
    await canvas.requestSave();
};