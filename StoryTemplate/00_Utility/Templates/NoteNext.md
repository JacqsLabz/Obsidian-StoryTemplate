<%*
const currentFile = app.workspace.getActiveFile();
const currentCache = app.metadataCache.getFileCache(currentFile);
const currentOrder = currentCache?.frontmatter?.Order;

if (currentOrder === undefined) {
    new Notice("This note is not part of the sequence (no 'Order' property).");
    return;
}

// 1. Find the Project Root by looking for "FolderName.base"
let projectFolder = currentFile.parent;
let rootPath = null;

while (projectFolder) {
    // We are looking for a file named exactly like the folder, but with .base
    const expectedBaseName = projectFolder.name + ".base";
    
    // Check if this specific .base file exists in the current folder level
    const hasBaseFile = projectFolder.children.some(f => f.name === expectedBaseName);
    
    if (hasBaseFile) {
        rootPath = projectFolder.path;
        break; // We found the project root!
    }
    
    // If not found, move one folder up the chain
    projectFolder = projectFolder.parent;
}

// Fallback if no .base file is found
if (!rootPath) {
    new Notice("Could not find a matching .base file to define the project boundary.");
    return;
}

// 2. Gather and sort the notes within this specific Project Root
const projectFiles = app.vault.getMarkdownFiles()
    .filter(f => f.path.startsWith(rootPath)) // Only look inside this project
    .map(f => ({
        file: f,
        Order: app.metadataCache.getFileCache(f)?.frontmatter?.Order
    }))
    .filter(f => typeof f.Order === 'number') // Ignore notes without a numeric Order
    .sort((a, b) => a.Order - b.Order); // Handle your floating decimals cleanly

// 3. Find where we are and jump to the Next note
const currentIndex = projectFiles.findIndex(f => f.file.path === currentFile.path);

if (currentIndex !== -1 && currentIndex < projectFiles.length - 1) {
    const nextFile = projectFiles[currentIndex + 1].file;
    app.workspace.getLeaf().openFile(nextFile);
} else {
    new Notice("You are at the end of this project's sequence.");
}
%>