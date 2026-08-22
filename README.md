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

There can be subfolders in a story, but the code isn't designed (aka has been tested with) sub-stories or the .base file being anywhere else. 

Use the "make scene" button on the notetoolbar any note that you want to turn into a scene. This gives it the hidden property "notetoolbar: draft" which gives it the toolbar with things like split, next, & previous. Next & previous rely on the "order" property to work. 

As of this writing, the Canvas Colors (on the note toolbars) is designed to have the name of the POV character for that scene in the "tags" field. Yes using the tags field is poor design. No I haven't cared enough to fix it (at least not yet). To change the characters (tags) and colors, you need to go outside of obsidian and open 00_Utility\QuickAdd-Scripts\canvasColorUpdater.js to change the colorMap near the top. Idk what it will do if you have multiple color tags on a single note. As far as the tags THEMSELVES having colors (in the properties), you need to go in the settings for Colored Tags Wrangler. 

----

by Jacquilyn Walker. Please give credit if you modify & share. Creative Commons Noncommercial ShareAlike license. 
