## Description

display source code

by default uses the current page source


## Include

```

      <page-source component></page-source>
      
```

## initmod


name      | description
----------|------------
ext | reference to ext loader 
$ | reference to dom helper library
menu | reference to menu group
source | function that returns data blob
complete | holds load and save callbacks
log | reference to log-mod component


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
clear () | clear the current publish status
query () | read the query string, holds publish status
delete () | delete the current publish state
save () | publish the current source
save.text () | publish the current source as text
save.file () | publish the current file object





