## Description

provides a ui for loading and saving files from google cloud storage

note :

uses the google-storage library for io operations


## Include

```

      <google-storage component></google-storage>
      
```

## initmod


name      | description
----------|------------
ext|reference to the ext loader helper
$|reference to the dom helper library
menu | reference to the current menu group 
source | a function to be called to get a source blob to save
log|reference to the log-mod component


## attribute

these attribute can be defined on the html tag itself

attribute     | description
---------     |-----------


## module


name|description
---|---
**standard** |
initmod | standard function for importing local dependencies
init | standard initialisation function
initdom | standard function to setup the dom
 | 
load ( file ) | load the file
save ( file, blob ) | save the blob to file





