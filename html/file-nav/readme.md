## Description

provide the ui for navigating files while in the electron dev environment

note :

this is only really working in electron environments


## Include

```

      <electron-fs component></electron-fs>
      
```

## initmod


name      | description
----------|------------
initmod|standard used to pass references to module
init|standard : used to initialise the module
initdom| standard : used to initialise the dom
 |
datatype | reference to the datatype function

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
update ( path? ) | update the file navigation structure
display ( path, dirs, files ) | display the directory structure
display.flat ( path,list ) | display the directory structure in list, this is a different flat directory structure, see API






