## Description

The web-editor component produces an editor in the webpage

A modern, feature‑rich text editor built directly into the browser, this component is designed to make writing and editing feel effortless. Whether you’re building documentation tools, note‑taking apps, or custom content interfaces, it provides a smooth, polished experience that fits naturally into any webpage. Its clean interface keeps the focus on the text, while thoughtful details make everyday editing tasks quicker and more intuitive.

Under the hood, the editor offers a flexible architecture that adapts to a wide range of use cases. It supports rich formatting, keyboard shortcuts, custom styling, and extensible behaviours, giving developers the freedom to tailor the writing environment to their needs. Despite its capabilities, it remains lightweight and responsive, ensuring fast load times and a fluid typing experience even in complex layouts.

This component is built with usability in mind, making it just as comfortable for casual writing as it is for more structured content creation. Whether you’re embedding it in a small widget or using it as the core of a larger application, it provides a dependable, modern editing foundation that feels right at home on the web.

## Include

```

      <web-editor component></web-editor>
      
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
fullsize  | true|false whether the editor should display the entire document
kd        | callback for keydown event
on        | callback for various events, see below
mode      | the mode for the editor, javascript,css,html etc
embed     | a dom node that the component will take its attributes from


#### config

config.mode    - set the mode for the editor, javascript,css,html,python etc

config.fullsize - true|false whether the editor should display the entire document

config.height - set the height of the editor


#### on

on.change - callback when the editor has a change event


## attribute

these attribute can be defined on the html tag itself

attribute     | description
---------     |-----------
src         | src url to load 
h \|\| height    | set the height of the editor
mode        | set the mode for the editor
fullsize    | boolean attribute, whether the editor display the entire document


## module

name|description
---|---
**standard** |
initmod   | standard function for importing local dependencies
init      | standard initialisation function
initdom   | standard function to setup the dom
 | 
filename ( file )    | set the filename that the editor display, also sets the mode
filename.getname ( path )    | helper function to return the filename from a path
filename.save ( status ) | show or hide the save status icon
filename.save.show () | show the save status icon
filename.save.hide () | hide the save status icon
filename.clear () | clear the filename
filename.read () | read the current filename
clear () | clear the editor
set \|\| setvalue \|\| setValue ( txt ) | set the text of the editor
get \|\| getvalue \|\| getValue () | get the text of the editor
focus () | set focus to the editor
resize () | update the editor dimensions ( width / height )
load ( src ) |
horiz () | set the editor to horizontal mode
vert () | set the editor to vertical mode
height | setter to set the height of the editor
mode | getter / setter to get and set the mode of the editor



## api


<section class=api-function>

### filename ( file ) {.api-function-title}

set the filename that the editor displays, also sets the mode

<div class=api-function-desc>

#### parameters

file - a file-mod file descriptor

#### returns

no return value

</div>

</section>


---

### filename.getname ( path ) () {.blue}

helper function to return the filename from a path

#### parameters

- path - string, the path of the file

#### returns

string - the filename


---


### filename.save ( status ) {.blue}

show or hide the save status icon

#### parameters

status - truthy value

#### returns

no return value


---


### filename.save.show () {.blue}

show the save status icon

#### parameters

no parameters

#### returns

no return value


---


### filename.save.hide () {.blue}

hide the save status icon

#### parameters

no parameters

#### returns

no return value


---


### filename.clear () {.blue}

clear the current filename

#### parameters

no parameters

#### returns

no return value


---


### filename.read () {.blue}

read the current filename

#### parameters

no parameters

#### returns

string - the filename


---


### clear () {.blue}

clear the editor

#### parameters

no parameters

#### returns

no return value


---


### set ( txt ) {.blue}

#### alias setvalue,setValue

set the text of the editor

#### parameters

txt - string, the text to set the editor to

#### returns

no return value


---


### get () {.blue}

#### alias getvalue,getValue

get the text of the editor

#### parameters

no parameters

#### returns

string - the text of the editor


---


### focus () {.blue}

focus the editor

#### parameters

no parameters

#### returns

no return value


---


### resize () {.blue}

call when the editor has changed size so it can be re-rendered

#### parameters

no parameters

#### returns

no return value


---


### load ( src ) {.blue}

fetch the file src and display it in the editor

( not implmeneted yet )

#### parameters

src - string, the url of the file to load

#### returns

no return value


---


### horiz () {.blue}

set the editor to horizontal mode

#### parameters

no parameters

#### returns

no return value


---


### vert () {.blue}

set the editor to vertical mode

#### parameters

no parameters

#### returns

no return value


---


### height {.blue}

setter to set the height of the editor

#### syntax

editor.height = 300;


---


### mode {.blue}

getter / setter for the mode of the editor, javascript,css,html,python etc

#### syntax

console.log(editor.mode) // html
editor.mode = 'javascript';












