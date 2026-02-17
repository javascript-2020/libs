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


</div>

</section>



      
      
      
