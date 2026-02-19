## api


--- {.hr-sub}


<section class=api-function>

### async load ( file ) {.api-function-title}

load the file specified by file file-mod file desciptor

<div class=api-function-desc>

#### parameters

- file - object - file-mod file descriptor


#### return

- blob - the loaded blob

</div>

</section>



--- {.hr-sub}


<section class=api-function>

### async load.ui ( url, path, filename ) {.api-function-title}

load the file specified by url / path / filename

<div class=api-function-desc>

#### parameters

- url - string - the server url 
```
https://localhost:3000
```
- path - string - the path of the file
```
/main/sub/
```
- filename - string - file filename
```
my-file.txt
```

</div>

#### return

- blob - the loaded file

</div>

</section>

      
--- {.hr-sub}


<section class=api-function>

### async save ( file, blob ) {.api-function-title}

save the blob to the file specified by file

<div class=api-function-desc>

#### parameters

- file - object - file-mod file descriptor
- blob - blob - the blob data

#### return

- boolean - true / false - status of the operation

</div>

</section>
      

--- {.hr-sub}


<section class=api-function>

### async save.ui ( url, path, filename ) {.api-function-title}

read the blob from source and save it

<div class=api-function-desc>

#### parameters

- url - string - the server url 
```
https://localhost:3000
```
- path - string - the path of the file
```
/main/sub/
```
- filename - string - file filename
```
my-file.txt
```

#### return

none

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### clear () {.api-function-title}

clear the current file

( not implemented yet )

<div class=api-function-desc>

#### parameters

none

#### return

none

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### export ( file ) {.api-function-title}

serialise file

<div class=api-function-desc>

#### parameters

- file - a [file-mod file descriptor](#)

#### return

- object - the exported file object

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





