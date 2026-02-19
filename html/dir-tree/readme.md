## Description

display a directory structure in a webpage


## Include

```

      <dir-tree component></dir-trere>
      
```

## initmod


name      | description
----------|------------


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
build(data)|takes a simple object structure and return a structure that dirtree can use ( see below )
display(data,options)|display the directory structure
clear|clear the directory tree
find(path)|find the object representing the directory
open(path)|expand the directory
close(path)|collapse the directory
test()|display test data



