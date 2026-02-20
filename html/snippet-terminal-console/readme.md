## Description

display an HTML file in the editor, with full file controls and ability to run it


## Include

```

      <snippet-html component></snippet-html>
      
```

## initmod


name      | description
----------|------------
ext | reference to ext loader 
$ | reference to dom helper library
menu | reference to menu group
ace | reference to ace editor otherwise each instance loads its own version
log | reference to log-mod component
config | configuration object, see below
github | reference to the github io library, else it loads it


## config

config['web-editor'] web-editor config, see web-editor


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
run () | run the current html





