## Description

The file-mod manages file access


## Include

requires component v3.0

```

      <file-mod component></file-mod>
      
```

## initmod


name      | description
----------|------------
ext       |       helper loader library
$         |       various dom helper functions
menumod   |       the menumod library
 |
menu      |       reference to the menu to add its menu's to
source    |       the source text
focus     |       function to reset focus
log       |       reference to log-mod component
 |
complete  |       handles loading ( complete.load ) and saving ( complete.save )


## attribute

these attribute can be defined on the html tag itself

attribute     | description
---------     |-----------
none | no supported attributes


## module


name|description
---|---
**standard** |
initmod|standard function for importing local dependencies
init|standard initialisation function
initdom|standard function to setup the dom
 | 
save ( file )   | read source blob and save under *file* or current file
clear ()        | clear the current file
new ( ...opts )   | alias for newfile
[newfile](#file-descriptor) ( ...opts )   | create a new file desciptor object
export ( file )   | serialise *file*
import ( file )   | deserialise *file*
test()|display test data


