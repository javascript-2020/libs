## Description

run a javascript snippet with console output


## Include

```

      <snippet-console component></snippet-console>
      
```

## initmod


name      | description
----------|------------
ext       | reference to ext-loader
$         | reference to $ library
ace       | reference to ace editor, else each instance of snippet-console loads its own
menu      | reference to the menu group snippet-console should use, else it creates its own
menumod   | reference to menumod library, only required if menu is not given
config    | config parameters, see below


## config

config['web-editor']    - see [web-editor](../web-editor/web-editor.html) for supported config

config['web-console']   - see [web-console](../web-console/web-console.html) for supported config


## attribute

these attribute can be defined on the html tag itself

attribute     | description
---------     |-----------
src|src url to load 
web-editor|pass config to web-editor ( see [web-editor](../web-editor/web-editor.html) for supported config )
web-console|pass config to web-console ( see [web-console](../web-console/web-console.html) for supported config )

## module


name|description
---|---
**standard** |
initmod|standard function for importing local dependencies
init|standard initialisation function
initdom|standard function to setup the dom
 | 
run|run the current snippet


## api

### run ()

run the code in the editor

#### parameters

no parameters

#### returns

no return value

