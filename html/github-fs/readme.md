## Description

provides a ui for navigating and loading / save / creating / deleting on a file system accessed via the file-server 


## Include

```

      <file-server component></file-server>
      
```

## initmod


name      | description
----------|------------
initmod|standard used to pass references to module
init|standard : used to initialise the module
initdom| standard : used to initialise the dom
 |
datatype | reference to the datatype function
menu | reference to the current menu group 
source | a function to be called to get a source blob to save
filemod | a reference to the file-mod component


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
load ( file ) | load the file specified by the file descriptor
load.ui ( url, path, filename ) | load a file specified by url / path / filename see API
save ( file ,blob ) | save the blob via the file descriptor file
save.ui ( url, path, filename ) | a blob is read from source and saved according to url / path / filename
clear () | clear the current file
export ( file? ) | serialise the file object or use the current file





