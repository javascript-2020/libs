## Description

display an editor which can run code with terminal output


## Include

```

      <snippet-terminal component></snippet-terminal>
      
```

## initmod


name      | description
----------|------------
ext | reference to ext loader 
$ | reference to dom helper library
log | reference to log-mod component
config | configuration object, see below
embed | use this node to read html attributes instead of the main host
menu | reference to menu group
menumod | reference to menumod library if menu is not given
Terminal | reference to xterm.js Terminal, otherwise it is loaded for each instance
FitAddon | reference to xterm.js FitAddon, otherwise it is loaded for each instance


## config

config.h  - set the height of the terminal
config.height -  set the height of the terminal
config.fullsize - set the terminal to fullsize, show all output rather than scrolling

## attribute

these attribute can be defined on the html tag itself

attribute     | description
---------     |-----------
h  | set the height of the terminal
height |  set the height of the terminal
fullsize | set the terminal to fullsize, show all output rather than scrolling



## module


name|description
---|---
**standard** |
initmod | standard function for importing local dependencies
init | standard initialisation function
initdom | standard function to setup the dom
 | 
write ( ...args ) | write to the terminal
writeln ( ...args ) | write to the terminal and add newline to the end
clear () | clear the terminal
error ( err ) | display an error object in the terminal
warn ( ...args ) | display a warning in the terminal
debug ( ...args ) | display debug info in the terminal
log ( ...args ) | display log info in the terminal



