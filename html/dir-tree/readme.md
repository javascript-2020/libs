## Description

displays a directory structure in a webpage


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


## api


### build(data)

takes a simple, easy to represent object structure representing a directory

```

      var data    = {
            'tmp'   : {
                  'tmp-1'   : {
                        'test.txt':null,
                  },
                  'my-file-1.bin':null,
                  'my-file-2.bin':null,
            },
            'hello-1.txt':null,
            'hello-2.txt':null,
      };

```

and produces a ibject structure that can be used by dir-tree to display the directory

```

              var data    = [
                    {
                          parent    : null,
                          type      : 'dir',
                          name      : 'tmp',
                          list      : [
                                {
                                      parent    : {object},
                                      type      : 'dir',
                                      name      : 'tmp-1',
                                      list      : [
                                            {
                                                  parent    : 'object',
                                                  type      : 'file',
                                                  name      : 'test.txt'
                                            }
                                      ]
                                },
                                {
                                      parent    : {object},
                                      type      : 'file',
                                      name      : 'hello.txt'
                                }
                          ]
                    }
              ];

```