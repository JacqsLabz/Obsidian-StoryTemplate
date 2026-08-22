<%*
const activeFile = app.workspace.activeEditor?.file;

if (!activeFile) {
    new Notice("Error: No active Markdown file found.");
    return;
}

await app.fileManager.processFrontMatter(activeFile, (frontmatter) => {
    // 1. Capture existing values or set defaults
    const existingOrder = frontmatter['Order'] ?? 0;
    const existingTags = frontmatter['tags'] ?? [];
    const existingSummary = frontmatter['Summary'] ?? "";
    
    // 2. Capture "The Rest" (excluding our specific top 3 and bottom 1)
    const others = {};
    const protectedKeys = ['Order', 'tags', 'Summary', 'notetoolbar'];
    
    for (const key in frontmatter) {
        if (!protectedKeys.includes(key)) {
            others[key] = frontmatter[key];
        }
    }

    // 3. WIPE AND RECONSTRUCT
    // We delete keys to force the JS engine to write them in our new Order
    for (const key in frontmatter) delete frontmatter[key];

    // Set Top 3
    frontmatter['Order'] = existingOrder;
    frontmatter['tags'] = existingTags;
    frontmatter['Summary'] = existingSummary;

    // Set "The Rest"
    for (const key in others) {
        frontmatter[key] = others[key];
    }

    // Set The Bottom
    frontmatter['notetoolbar'] = 'draft';
});

new Notice("Properties Standardized!");
%>