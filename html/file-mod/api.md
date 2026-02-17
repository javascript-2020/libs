## api


<section class=api-function>

### save ( file ) {.api-function-title}

reads a blob from source and saves it according to the file descriptor, then calls complete.save( file )

<div class=api-function-desc>

#### parameters

- file ( object ) - a [file-mod file descriptor](#)

#### return

none

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### clear () {.api-function-title}

clear the current file.  file-mod maintains a reference to the current file so that save can be called
externally, ie say ctrl-s

<div class=api-function-desc>

#### parameters

none

#### return

none

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### new () {.api-function-title}

alias for newfile


--- {.hr-sub}


<section class=api-function>

### newfile ({filetype,path,name,rel,kind,size,ctime,mtime,atime,title,icon}) {.api-function-title}

create a file descriptor object

<div class=api-function-desc>

#### parameters

- **filetype || ft** = the filetype ( localfile,github,googlestorage ... )

- **abs**     = the absolute path of the file

- **path**    = path of the file

- **name**    = the name of the file

- **rel**     = relative path for the file, should this be relevant

- **kind**    = kind of file structure this file object represents ( file,directory )

- **size**    = the size of the file in bytes

- **ctime**   = the create time of the file 

- **mtime**   = the modified time of the file

- **atime**   = the last access time of the file

- **title**   = the title for the file

- **icon**    = an icon for the file


#### return

- **file ( object )** — the file descriptor


#### Errors
- **none**

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### export ( file? ) {.api-function-title}

serialise and return file or the current file

<div class=api-function-desc>

#### parameters

- **file ( object )** - a [file-mod file descriptor](#)

#### return

- string - the serialised file object

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








