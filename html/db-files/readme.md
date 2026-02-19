## Description

provides a access to a virtual file system contained in indexeddb


## Include

```

      <db-files component></db-files>
      
```

## initmod


name      | description
----------|------------
initmod|standard used to pass references to module
init|standard : used to initialise the module
initdom| standard : used to initialise the dom
 |
datatype| reference to the datatype function
menumod|reference to the menu library
menu| reference to the menu group to add the ui to
source|function that returns the source blob ( blob to save )
filemod|reference to the file-mod module
log|reference to the log-mod module for status and error reporting


## attribute

these attribute can be defined on the html tag itself

attribute     | description
---------     |-----------


## module


name|description
---|---
**standard** |
initmod|standard function for importing local dependencies
init|standard initialisation function
initdom|standard function to setup the dom
 | 
load ( file ) | load file
load.ui ( path,name ) | load file from path / name
save ( file,blob ) | save blob to file
save.ui ( path,name ) | read the blob from source and save to file
newfile ( {path,name} )|create a new db-files file descriptor from path / name




