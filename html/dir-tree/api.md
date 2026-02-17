## api


--- {.hr-sub}


<section class=api-function>

### build( data ) {.api-function-title}

takes a simple, easy to represent object structure representing a directory and produces an object structure that can be used by dir-tree to display the directory


<div class=api-function-desc>

#### parameters

- data 
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


#### return

- object
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

#### Errors

**none**

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### display (data, options) {.api-function-title}

display directory structure data

<div class=api-function-desc>

#### parameters

- data - directory structure of the form
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
- options - object
<div style='padding-left:50px'>

**options.callback** - object

**options.callback.dir** - function ( name,o ) - callback when directory is clicked, name - name of directory, o - the original object in the data structure, return from callback [false] prevent default,
ie opening and closing directory

**options.callback.file** - function (name,o ) - callback when file is clicked, name - name of file, o - the original object in the data structure

</div>

#### return

none

#### Errors

**none**

</div>

</section>

      
--- {.hr-sub}


<section class=api-function>

### clear () {.api-function-title}

clear the directory tree

<div class=api-function-desc>

#### parameters

**none**

#### return

**none**

#### Errors

**none**

</div>

</section>
      

--- {.hr-sub}


<section class=api-function>

### find ( path ) {.api-function-title}

return the original object in the data structure for a given path

<div class=api-function-desc>

#### parameters

- path - string - the path to find

#### return

- object - the original data structure object

#### Errors

**none**

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### open ( path ) {.api-function-title}

open the directory specified by path

<div class=api-function-desc>

#### parameters

- path - string - the path to open

#### return

- object - the original object in the data structure

#### Errors

**none**

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### close ( path ) {.api-function-title}

close the directory specified by path

<div class=api-function-desc>

#### parameters

- path - string - the path of the directory to close

#### return

- object - the original object om the data structure

#### Errors

**none**

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### test () {.api-function-title}

display a test directory

<div class=api-function-desc>

#### parameters

none

#### return

none

#### Errors

**none**

</div>

</section>



<!--

--- {.hr-sub}


<section class=api-function>

### filename ( file ) {.api-function-title}

set the filename that the editor displays, also sets the mode

<div class=api-function-desc>

#### parameters

- file - a [file-mod file descriptor](#)

#### return

none

</div>

</section>

-->






