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


### clear ( )

clear the current file.  file-mod maintains a reference to the current file so that save can be called
externally, ie say ctrl-s


### new ()

alias for newfile


### newfile (

filetype = the filetype ( localfile,github,googlestorage ... )

abs = the absolute path of the file

path    = the path for the file

name,   = the name of the file

rel     = relative path for the file, should this be relevant

kind    = kind of file structure this file object represents ( file,directory )

size    = the size of the file in bytes

ctime   = the create time of the file 

mtime   = the modified time of the file

atime   = the last access time of the file

title   = the title for the file

icon    = an icon for the file

### )


### export ( file )

serialise and return file or the current file

