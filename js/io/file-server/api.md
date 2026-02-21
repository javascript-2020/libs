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


--- {.hr-sub}


<section class=api-function>

### file.create ( { path, url?, hdrs? } ) {.api-function-title}

create a file at path

<div class=api-function-desc>

#### parameters

- path - string - the path of the file ```/main/sub/my-file.txt``` {.code-inline}
- url - optional if set via library.url - the url of the server ```httpsL//localhost:3000``` {.code-inline}
- hdrs - optional if set via library.hdrs - the headers object sent with the request ```{'x-custom-header':'123'}``` {.code-inline}

#### return

- object - {ok,error}
  - ok - string - ok message
  - error - string - error message

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### file.delete ( { path, url?, hdrs? } ) {.api-function-title}

#### alias : file.del

delete file at path

<div class=api-function-desc>

#### parameters

- path - string - the path of the file ```/main/sub/my-file.txt``` {.code-inline}
- url - optional if set via library.url - the url of the server ```httpsL//localhost:3000``` {.code-inline}
- hdrs - optional if set via library.hdrs - the headers object sent with the request ```{'x-custom-header':'123'}``` {.code-inline}

#### return

- object - {ok,error}
  - ok - string - ok message
  - error - string - error message

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### file.upload ( { path, blob, url?, hdrs? } ) {.api-function-title}

upload blob to path

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


--- {.hr-sub}


<section class=api-function>

### file.download ( { path, url?, hdrs? } ) {.api-function-title}

download file from path

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

### dir.read ( { path, url?, hdrs? } ) {.api-function-title}

read the content of directory path

<div class=api-function-desc>

#### parameters

- path - string - the path of the file ```/main/sub/my-file.txt``` {.code-inline}
- url - optional if set via library.url - the url of the server ```httpsL//localhost:3000``` {.code-inline}
- hdrs - optional if set via library.hdrs - the headers object sent with the request ```{'x-custom-header':'123'}``` {.code-inline}

#### return

- object - {dirs,files,error}
  - dirs - array - directory names
  - files - array - file names
  - error - string - error message

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### dir.create ( { path, url?, hdrs? } ) {.api-function-title}

create a directory

<div class=api-function-desc>

#### parameters

- path - string - the path of the file ```/main/sub/my-file.txt``` {.code-inline}
- url - optional if set via library.url - the url of the server ```httpsL//localhost:3000``` {.code-inline}
- hdrs - optional if set via library.hdrs - the headers object sent with the request ```{'x-custom-header':'123'}``` {.code-inline}

#### return

- object - {ok,error}
  - ok - string - ok message
  - error - string - error message

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### dir.delete ( { path, url?, hdrs? } ) {.api-function-title}
### alias : dir.del

delete directory recursively

<div class=api-function-desc>

#### parameters

- path - string - the path of the file ```/main/sub/my-file.txt``` {.code-inline}
- url - optional if set via library.url - the url of the server ```httpsL//localhost:3000``` {.code-inline}
- hdrs - optional if set via library.hdrs - the headers object sent with the request ```{'x-custom-header':'123'}``` {.code-inline}

#### return

- object - {ok,error}
  - ok - string - ok message
  - error - string - error message

</div>

</section>


--- {.hr-sub}


<section class=api-function>

### dir.clear ( { path, url?, hdrs? } ) {.api-function-title}

clear the directory

<div class=api-function-desc>

#### parameters

- path - string - the path of the file ```/main/sub/my-file.txt``` {.code-inline}
- url - optional if set via library.url - the url of the server ```httpsL//localhost:3000``` {.code-inline}
- hdrs - optional if set via library.hdrs - the headers object sent with the request ```{'x-custom-header':'123'}``` {.code-inline}

#### return

- object - {ok,error}
  - ok - string - ok message
  - error - string - error message

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