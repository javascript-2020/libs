## Description

display the directory structure, allows navigating around directories, loading and creating files and directories


## Include

```

      <file-nav component></file-nav>
      
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







