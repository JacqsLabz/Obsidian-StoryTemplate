module.exports = async (params) => {
    const { app } = params;

    // --- CONFIGURATION START ---
    
    // keys = your tags (case insensitive, # is optional)
    // values = color code ("1"-"6") OR hex string ("#ff0000")
    // 1=Red, 2=Orange, 3=Yellow, 4=Green, 5=Cyan, 6=Purple
    const colorMap = {
        // "keyName" : "valueGoesHere",
        "Jessica": "#f11e1e",
        "Sally": "#fbe918",
        "John": "#2f7dd6",
        // "custom": "#4b0082",   // Example: Indigo (Custom Hex)
        // "darkmode": "#202020",  // Example: Near Black (Custom Hex)
    };

    // --- CONFIGURATION END ---

    // Helper: clean tag strings (remove # and make lowercase for comparison)
    function cleanTag(tag) {
        if (!tag) return "";
        return tag.replace(/^#/, "").toLowerCase();
    }

    // 1. Prepare the map for easy lookup
    const normalizedMap = {};
    for (const key in colorMap) {
        normalizedMap[cleanTag(key)] = colorMap[key];
    }

    // 2. Logic to find the color for a specific file
    function getColorForFile(file) {
        const cache = app.metadataCache.getFileCache(file);
        
        // Immediate exit if no frontmatter tags
        if (!cache || !cache.frontmatter || !cache.frontmatter.tags) {
            return null; 
        }

        let fileTags = cache.frontmatter.tags;
        
        // Handle case where tags is a single string instead of an array
        if (typeof fileTags === 'string') {
            fileTags = [fileTags];
        }

        // Check if any file tag exists in our map
        for (const tag of fileTags) {
            const clean = cleanTag(tag);
            if (normalizedMap[clean]) {
                return normalizedMap[clean];
            }
        }

        return null; // No matching tag found
    }

    // 3. Main Execution
    const canvasFiles = app.vault.getFiles().filter(f => f.extension === "canvas");
    let updatedCanvases = 0;
    let totalCardsUpdated = 0;

    for (const canvasFile of canvasFiles) {
        let fileContent = await app.vault.read(canvasFile);
        let canvasData;
        
        try {
            canvasData = JSON.parse(fileContent);
        } catch (e) {
            console.error(`Failed to parse canvas: ${canvasFile.path}`, e);
            continue;
        }

        let isModified = false;

        if (canvasData.nodes && Array.isArray(canvasData.nodes)) {
            for (const node of canvasData.nodes) {
                // Skip non-file nodes
                if (node.type !== "file") continue;

                const linkedFile = app.metadataCache.getFirstLinkpathDest(node.file, canvasFile.path);
                
                // If file is deleted/missing, skip
                if (!linkedFile) continue;

                const intendedColor = getColorForFile(linkedFile);
                const currentColor = node.color;

                // CASE A: We found a mapped tag, but the card color is wrong (or empty)
                if (intendedColor && currentColor !== intendedColor) {
                    node.color = intendedColor;
                    isModified = true;
                    totalCardsUpdated++;
                }
                // CASE B: We found NO mapped tag, but the card has a color (Cleanup)
                // We only remove the color if it currently matches one of our map colors.
                // (This prevents overwriting manual colors you set that aren't in the map)
                else if (!intendedColor && currentColor) {
                     // Check if the current color is one of the ones we manage
                     const isManagedColor = Object.values(normalizedMap).includes(currentColor);
                     
                     if (isManagedColor) {
                         delete node.color; // Remove property to reset to default
                         isModified = true;
                         totalCardsUpdated++;
                     }
                }
            }
        }

        if (isModified) {
            await app.vault.modify(canvasFile, JSON.stringify(canvasData, null, "\t"));
            updatedCanvases++;
        }
    }

    if (updatedCanvases > 0) {
        new Notice(`Updated ${updatedCanvases} canvases (${totalCardsUpdated} cards).`);
    } else {
        new Notice(`Canvas colors are already up to date.`);
    }
}