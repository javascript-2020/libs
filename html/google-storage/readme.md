## Description

provides a ui for navigating and loading and saving files from github

note :

uses the github library for io operations


## Include

```

      <github-fs component></github-fs>
      
```

## initmod


name      | description
----------|------------
ext|reference to the ext loader helper
$|reference to the dom helper library
menu | reference to the current menu group 
focus|function to send focus when the menu closes
source | a function to be called to get a source blob to save
log|reference to the log-mod component


## attribute

these attribute can be defined on the html tag itself

attribute     | description
---------     |-----------


## module


name|description
---|---
**standard** |
initmod | standard function for importing local dependencies
init | standard initialisation function
initdom | standard function to setup the dom
 | 
read () | read the current values from the ui
read.token () | read the value of the github token
write( owner, repo, branch, path ) | write values to the ui
clear () | clear the values from the ui
load ( file, api ) | load the file
save ( file, blob ) | save the blob to file
export () | export the file object
icon () | read the src value of the icon





