## Description

display an editor which can run the code, with terminal and console output


## Include

```

      <snippet-terminal-console component></snippet-terminal-console>
      
```

## initmod


name      | description
----------|------------
ext | reference to ext loader 
$ | reference to dom helper library
menu | reference to menu group
menumod | reference to menumod library if menu is not given
ace | reference to ace editor otherwise each instance loads its own version
config | configuration object, see below
log | reference to log-mod component
echo | boolea, whether to echo terminal output to dev tools console


## config

config['web-editor'] web-editor config, see web-editor
config['web-terminal']  web-terminal config, see web-terminal


## attribute

these attribute can be defined on the html tag itself

attribute     | description
---------     |-----------
src | src url to load


## module


name|description
---|---
**standard** |
initmod | standard function for importing local dependencies
init | standard initialisation function
initdom | standard function to setup the dom
 | 
filemod | reference to the file-mod component
editor | reference to the web-editor component
terminal | reference to the web-terminal component





