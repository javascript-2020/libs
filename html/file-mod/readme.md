## Description

The file-mod manages various file access


## Include

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
new ( ...opts ), newfile( ...opts )   | create a new file object, see below
export ( file )   | serialise *file*
import ( file )   | deserialise *file*
test()|display test data


## api


### save ( file )

reads a blob from source and saves it according to the file descriptor, then calls complete.save( file )


### load ( file )

loads a blob from file descriptor, then calls complete.load( file,blob )

