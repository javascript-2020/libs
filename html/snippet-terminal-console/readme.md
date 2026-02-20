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
ace | reference to ace editor otherwise each instance loads its own version
on | server events, see API
log | reference to log-mod component
config | configuration object, see below


## config

config['web-editor'] web-editor config, see web-editor
config['web-terminal']  web-terminal config, see web-terminal
config['web-console'] web-console config, see web-console


## attribute

these attribute can be defined on the html tag itself

attribute     | description
---------     |-----------
src | src url to load
mode | mode for running, typically nodejs | browser


## module


name|description
---|---
**standard** |
initmod | standard function for importing local dependencies
init | standard initialisation function
initdom | standard function to setup the dom
 | 
btn.run | override the run button with this callback, see API
run () | run the current html





