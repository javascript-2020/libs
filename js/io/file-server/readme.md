## Description

This library interfaces the [file-server](/code/nodejs/servers/file-server/file-server.html) [ ext-code.com ] to expose direct file system operations to the browser through a simple http‑based API.

Note : 

As of recent browser changes PNA ( Private Network Access ) restrictions are now implemented, this code works in the main page,
however there are still some issues running it in the editors which run in an iframe


## Include

```

<script src='https://libs.ext-code.com/js/io/file-server/file-server.js'></script>

<script>

        console.log(window['file-server'].version)
        
</script>

```



## Module

name | description
---|---

url | set the default url for the server
hdrs | set default headers object for the server
auth | set the default auth header for the server
 |
file.load ( { path, url?, hdrs? } ) | load file data
file.load.txt ( { path, url?, hdrs? } ) | load file data as text
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





      
      
      
