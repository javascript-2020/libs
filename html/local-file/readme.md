## Description

provides a ui for loading and saving files from the local computer

note :

uses <input type=file> for instance


## Include

```

      <local-file component></local-file>
      
```

## initmod


name      | description
----------|------------
$|reference to the dom helper library
menu | reference to the current menu group 
filemod | reference to the file-mod component
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
clear () | clear the current file





