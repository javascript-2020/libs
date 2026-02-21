## API



<section class=api-function>

### url {.api-function-title}

set the base url for the server in the library, saves having to include it with every function call

<div class=api-function-desc>

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### hdrs {.api-function-title}

set the hdrs object for the server in the library, saves having to include it with every function call

<div class=api-function-desc>

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### auth {.api-function-title}

set the auth for the server in the library, saves having to include it with every function call

<div class=api-function-desc>

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### async : file.load ( { path, url?, hdrs? } ) {.api-function-title}

load the file at path


<div class=api-function-desc>

#### parameters

- path - string - the path of the file ```/main/sub/my-file.txt``` {.code-inline}
- url - optional if set via library.url - the url of the server ```httpsL//localhost:3000``` {.code-inline}
- hdrs - optional if set via library.hdrs - the headers object sent with the request ```{'x-custom-header':'123'}``` {.code-inline}


#### return

- object - {blob,error}
  - blob - blob - the file data
  - error - string - error message

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### file.save ( { path, blob, url?, hdrs? } ) {.api-function-title}

save blob to path

<div class=api-function-desc>

#### parameters

- path - string - the path of the file ```/main/sub/my-file.txt``` {.code-inline}
- blob - blob - the file data
- url - optional if set via library.url - the url of the server ```httpsL//localhost:3000``` {.code-inline}
- hdrs - optional if set via library.hdrs - the headers object sent with the request ```{'x-custom-header':'123'}``` {.code-inline}

#### return

- object - {ok,error}
  - ok - string - ok message
  - error - string - error message

</div>

</section>




file.save ( { path, blob, url?, hdrs? } ) | save blob to path
file.create ( {path, url?, hdrs? } ) | create a file at path
file.delete ( {path, url?, hdrs? } ) | delete file at path
file.del | file.delete alias
file.upload ( { path, blob, url?, hdrs? } ) | upload file
file.download ( { path, url?, hdrs? } ) | download file
 |      
dir.read ( { path, url?, hdrs? } ) | read directory
dir.create ( { path, url?, hdrs? } ) | create directory
dir.delete ( { path, url?, hdrs? } ) | delete directory
dir.del | alias for dir.delete
dir.clear ( { path, url?, hdrs? } ) | clear the directory



      
      
      
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
