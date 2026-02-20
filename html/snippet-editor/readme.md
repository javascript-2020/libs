## Description

display a file in the editor, with full file controls


## Include

```

      <snippet-editor component></snippet-editor>
      
```

## initmod


name      | description
----------|------------
ext | reference to ext loader 
$ | reference to dom helper library
menu | reference to menu group
ace | reference to ace editor otherwise each instance loads its own version
menumod | reference to the menumod library, if menu is not given
log | reference to log-mod component
config | configuration object, see below
github | reference to the github io library, else it loads it


## config

config['web-editor'] web-editor config, see web-editor


## attribute

these attribute can be defined on the html tag itself

attribute     | description
---------     |-----------
mode | mode for the webieditor, css, html, js etc
src | src url to load
fullsize | put the editor in fullsize mode

## module


name|description
---|---
**standard** |
initmod | standard function for importing local dependencies
init | standard initialisation function
initdom | standard function to setup the dom
 | 





