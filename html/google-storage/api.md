## api


--- {.hr-sub}


<section class=api-function>

### read () {.api-function-title}

read the values from the ui : token, owner, repo, branch, path


<div class=api-function-desc>

#### parameters

none


#### return

- object - the values {token,owner,repo,branch,path}

</div>

</section>



--- {.hr-sub}


<section class=api-function>

### read.token () {.api-function-title}

read the value of the token from the ui

<div class=api-function-desc>

#### parameters

none

</div>

#### return

- string - the token

</div>

</section>

      
--- {.hr-sub}


<section class=api-function>

### write ( owner, repo, branch, path ) {.api-function-title}

write the values of the ui

<div class=api-function-desc>

#### parameters

- owner - string - the repo owner
- repo - string - the repo name
- branch - string - the repo branch name
- path - string - the path 

#### return

none

</div>

</section>
      

--- {.hr-sub}


<section class=api-function>

### load ( file, api) {.api-function-title}

load the file

<div class=api-function-desc>

#### parameters

- file - object - file-mod file descritor
- api - boolean - whether to use the github api or raw.githubusercontent.com url

#### return

 - result

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### save ( file, blob ) {.api-function-title}

save the blob


<div class=api-function-desc>

#### parameters

- file - object - file descriptor
- blob - blob - the file data to save

#### return

- result

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### export () {.api-function-title}

export the values from the ui

<div class=api-function-desc>

#### parameters

none

#### return

- object - {owner,repo,branch,path}

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### icon () {.api-function-title}

retrieve icon src value

<div class=api-function-desc>

#### parameters

none

#### return

- string - the icon src value ( image data )

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





