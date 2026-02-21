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

- path - string - the path of the file
```
/main/sub/my-file.txt
```
- url - optional if set via library.url - the url of the server
```
httpsL//localhost:3000
```
- hdrs - optional if set via library.hdrs - the headers object sent with the request

#### return

- object - {blob,error}

- blob - blob - the file data
- error - string - error message

</div>

</section>







        obj.file.load           = loadfile;
        obj.file.load.txt       = loadfiletxt;
        obj.file.save           = savefile;
        obj.file.create         = mkfile;
        obj.file.delete         = rmfile;
        obj.file.del            = rmfile;
        obj.file.upload         = upload;
        obj.file.download       = download;
        
        
        obj.dir                 = {};
        obj.dir.read            = readdir;
        obj.dir.create          = mkdir;
        obj.dir.delete          = rmdir;
        obj.dir.del             = rmdir;
        obj.dir.clear           = dirclear;



load → retrieve file contents

save → write or overwrite file data

file delete → remove a file

dir read → list directory contents

dir create → make a new directory

dir delete → remove a directory




      
      
      
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
