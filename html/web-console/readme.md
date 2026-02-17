## Description

The web-console provides a console ( like dev tools ) in a webpage.

A lightweight, embeddable component that brings a fully interactive DevTools‑style console directly into your webpage. It captures
console.log, warn, error, and custom messages, displaying them in a scrollable UI that mirrors the feel of a browser’s built‑in
developer console.

Designed for demos, sandboxes, tutorials, and debugging in environments where the native DevTools aren’t available or convenient.

Has the option to echo to the console.


**Key Features**

- Real‑time logging of standard console output

- Supports logs, warnings, errors, and custom message types

- Expandable object/JSON inspection

- Clear‑console functionality

- Optional command input for evaluating JavaScript expressions

- Fully stylable and framework‑agnostic

- Ideal for embedded widgets, documentation examples, and teaching tools


## Include

```

      <web-console component></web-console>
      
```

## initmod


name      | description
----------|------------
$         |	the dom helper library
ace       | a global reference to ace editor, otherwise each instance of the web-console will load its own ace editor, specifying this ensures its only loaded once
embed     | allows reading the supported attributes from another node
config    | config parameters, see below
echo      | whether to echo the output to the dev tools console



## attributes

these attribute can be defined on the html tag itself

attribute     | description
---------     |-----------
fullsize      | the console will keep expanding to show all content
h \| height   | sets the height of the console


## module

methods without a description are not currently implmented and are passed through to dev tools


name|description
---|---
**standard** |
initmod|standard function for importing local dependencies
init|standard initialisation function
initdom|standard function to setup the dom
 | 
**console** | 
assert|
clear|clear the console
count|
countReset|
debug|write debug information to the console
dir|
dirxml|
error|display error information in the console
group|
groupCollapsed|
groupEnd|
info|
log|log data to the console
profile|
profileEnd|
table|
time|
timeEnd|
timeLog|
timeStamp|
trace|
warn|display warn information in the console
 | 
**extended** | 
write|write to the console, without adding a newline character at the end of the output
json|write json stringified output to the console
 | 
 | 
test|display test data in the console, for quick tests




