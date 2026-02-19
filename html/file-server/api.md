## api


--- {.hr-sub}


<section class=api-function>

### update ( path? ) {.api-function-title}

update the directory structure



<div class=api-function-desc>

#### parameters

- path - string - optional - the path to the directory


#### return

none

</div>

</section>



--- {.hr-sub}


<section class=api-function>

### display ( path, dirs, files ) {.api-function-title}

display the directory

<div class=api-function-desc>

#### parameters

- path - string - file  path
- dirs - array [ string ] - the directory names
- files - array [ string ] - the file names

</div>

#### return

none

</div>

</section>

      
--- {.hr-sub}


<section class=api-function>

### display.flat ( path, list ) {.api-function-title}

display the directory using a flat directory structure

```

      [
            '/main/sub/file-1.txt',
            '/main/sub-2/file-2.txt',
      ]
      
```

<div class=api-function-desc>

#### parameters

- path - string - the directory path
- list - array [ string ] - the list of files

#### return

none

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





