# Example Story Universe

So the purpose of this vault is to serve as an example of a "blank" vault all setup to hold a story universe. 

You can download it, and then open it with Obsidian. Obviously, you have to enable plugins for things to work. 

## Usage

To navigate, I recommend using the obsidian bookmarks (not the obsidian files panel). 

To make a story (novel, book, whatever) you need to make a folder with a name, and then make a .base file with that EXACT same name as the folder in that folder (direction in the folder, not a subfolder). Like:

```
MyStoryName/
MyStoryName/MyStoryName.base
```

There can be subfolders in a story, but the code isn't designed (aka has not been tested with) sub-stories or the .base file being anywhere else. 

Use the "make scene" button on the notetoolbar any note that you want to turn into a scene. This gives it the hidden property "notetoolbar: draft" which gives it the toolbar with things like split, next, & previous. Next & previous rely on the "order" property to work. 

### Canvas Colors

As of this writing, the Canvas Colors (on the note toolbars) is designed to have the name of the POV character for that scene in the "tags" field. Yes using the tags field is poor design. No I haven't cared enough to fix it (at least not yet). To change the characters (tags) and colors, you need to go outside of obsidian and open 00_Utility\QuickAdd-Scripts\canvasColorUpdater.js to change the colorMap near the top. Idk what it will do if you have multiple color tags on a single note. As far as the tags THEMSELVES having colors (in the properties), you need to go in the settings for Colored Tags Wrangler. 

### Canvas delete 

Using shift + backspace on the canvas removes the note too. Delete and backspace still just remove the card from the canvas (while keeping the note file), but I wanted a way to just make it stop existing all together directly from the canvas. 

### Files of note
- stignore.txt - If you use SyncThing, set it to use import this for it's ignore pattern by using the first line. In the txt file, it's commented out (to prevent a loop), but inside syncthing just put "#include stignore.txt" (without the quotes, duh) in the ignore pattern box. 
- .gitignore - I've included this incase you want to use it. 
- z-Merged.bat - Inside 05_Stories\10_Part1\First Story, there's a file z-Merged.bat. When ran/executed on a windows machine this makes a single merged file of all .md and .canvas files in the current folder (and all subfolders). It names the merged file including the name of the folder it's inside of. 

----

by Jacquilyn Walker. Please give credit if you modify & share. Creative Commons Noncommercial ShareAlike license. 
