## api

--- {.hr-sub}


<section class=api-function>

### filename ( file ) {.api-function-title}

set the filename that the editor displays, also sets the mode

<div class=api-function-desc>

#### parameters

- file - a [file-mod file descriptor](#)

#### return

none

#### Errors

**none**

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### filename.getname ( path ) () {.blue}

helper function to return the filename from a path

<div class=api-function-desc>

#### parameters

- path - string, the path of the file

#### return

- string - the filename

#### Errors

**none**

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### filename.save ( status ) {.blue}

<div class=api-function-desc>

show or hide the save status icon

#### parameters

- status - truthy value

#### return

none

#### Errors

**none**

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### filename.save.show () {.blue}

<div class=api-function-desc>

show the save status icon

#### parameters

no parameters

#### return

none

#### Errors

**none**

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### filename.save.hide () {.blue}

<div class=api-function-desc>

hide the save status icon

#### parameters

no parameters

#### return

none

#### Errors

**none**

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### filename.clear () {.blue}

<div class=api-function-desc>

clear the current filename

#### parameters

no parameters

#### return

none

#### Errors

**none**

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### filename.read () {.blue}

<div class=api-function-desc>

read the current filename

#### parameters

no parameters

#### return

- string - the filename

#### Errors

**none**

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### clear () {.blue}

<div class=api-function-desc>

clear the editor

#### parameters

no parameters

#### return

none

#### Errors

**none**

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### set ( txt ) {.blue}

#### setvalue, setValue {.blue}

<div class=api-function-desc>

set the text of the editor

#### parameters

- txt - string, the text to set the editor to

#### return

none

#### Errors

**none**

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### get () {.blue}

#### getvalue, getValue {.blue}

<div class=api-function-desc>

get the text of the editor

#### parameters

no parameters

#### return

- string - the text of the editor

#### Errors

**none**

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### focus () {.blue}

<div class=api-function-desc>

focus the editor

#### parameters

no parameters

#### return

none

#### Errors

**none**

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### resize () {.blue}

<div class=api-function-desc>

call when the editor has changed size so it can be re-rendered

#### parameters

no parameters

#### return

none

#### Errors

**none**

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### load ( src ) {.blue}

<div class=api-function-desc>

fetch the file src and display it in the editor

( not implmeneted yet )

#### parameters

- src - string, the url of the file to load

#### return

no return value

#### Errors

**none**

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### horiz () {.blue}

<div class=api-function-desc>

set the editor to horizontal mode

#### parameters

no parameters

#### return

none

#### Errors

**none**

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### vert () {.blue}

<div class=api-function-desc>

set the editor to vertical mode

#### parameters

no parameters

#### return

none

#### Errors

**none**

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### height {.blue}

<div class=api-function-desc>

setter to set the height of the editor

#### syntax

editor.height = 300;

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### mode {.blue}

<div class=api-function-desc>

getter / setter for the mode of the editor, javascript,css,html,python etc

#### syntax

console.log(editor.mode) // html
editor.mode = 'javascript';

</div>

</section>


--- {.hr-sub}



      
      
      
