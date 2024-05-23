
# glob

function for working with glob patterns

## useage

var result    =  glob(glob,str);

glob - glob pattern
str - string to see if it matches


returns 

boolean


## examples

glob('*.js','example.js')        //  true
glob('http*.js','example.js')    //  false


