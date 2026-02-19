## api


--- {.hr-sub}


<section class=api-function>

### async load ( file ) {.api-function-title}

load a blob from file descriptor file



<div class=api-function-desc>

#### parameters

- file - object - a file-mod file descriptor


#### return

- blob
- 
</div>

</section>


--- {.hr-sub}


<section class=api-function>

### load.ui ( path, name ) {.api-function-title}

creates a file-mod file descriptor and loads the blob from path / name

optionally calls user defined callback when finished

load.complete( file,blob ) 


<div class=api-function-desc>

#### parameters

- path - string - file  path
- name - string - filename

</div>

#### return

- blob - the loaded blob

#### Errors

none

</div>

</section>

      
--- {.hr-sub}


<section class=api-function>

### save ( file, blob ) {.api-function-title}

save the blob using file-mod file descriptor

optionally call user defined callback function 

save.complete( file )

<div class=api-function-desc>

#### parameters

- file - file-mod file descriptor
- blob - the blob to save

#### return

none

#### Errors

none

</div>

</section>
      

--- {.hr-sub}


<section class=api-function>

### save.ui ( path,name ) {.api-function-title}

creates a file descriptor from path / name and reads the blob from source

then calls save( file,blob )

<div class=api-function-desc>

#### parameters

- path - string - the path of the file
- name - string - the filename

#### return

none

#### Errors

none

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### newfile ( {path,name} ) {.api-function-title}

create a file-mod file descriptor from path / name

<div class=api-function-desc>

#### parameters

- path - string - the file path
- name - string - the filename

#### return

- file - object - the file-mod file descriptor

#### Errors

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





