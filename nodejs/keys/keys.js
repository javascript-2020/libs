


/*

//keys:d

13-11-23

*/



        module.exports    = keysmod();
        
function keysmod(){

  var obj   = {};
  
  
        if(!process.stdin.isTTY){
                                                                                console.log('not tty');
              return;
        }
        
        var ctrlc   = '\u0003';
        var esc     = String.fromCharCode(27);
        
        process.stdout.setEncoding('utf8');
        
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.on('data',keypressed);
        
        
        function keypressed(key){
        
              if(typeof obj.keypressed=='function'){
                    var result    = obj.keypressed(key);
                    if(result===false){
                          return;
                    }
              }
              
              if(key==='r'){
                    if(typeof obj.reload!=='function'){
                          console.log('reload not enabled');
                          return;
                    }
                    
                    rem();
                    clear();
                    console.log('reload');
                    obj.reload();
              }
              
              if(
                    (key===ctrlc)   ||
                    (key==='q')     ||
                    (key===esc)
              ){
                    process.exit();
              }
              
              if(key===' '){
                    clear();
                    console.log('---   clear   ---');
              }
              
              if(key==='-'){
                    console.log('---   ...    ---');
              }
              
        }//keypressed
        
        
        obj.rem=function(){return rem()}    //d
        
        function rem(){
        
              process.stdin.off('data',keypressed);
              
        }//rem
        
        
        obj.clear=function(){return clear()}    //d
        
        function clear(){
        
              process.stdout.write('\x1Bc');
              //process.stdout.write('\033c');
              console.clear();
              
        }//clr
        
/*
    if (key === '\r' || key === '\n') {
        console.log('Key detected: ENTER');
        return;
    }

    // 3. Check for Backspace / Delete
    if (key === '\u007f' || key === '\b') {
        console.log('Key detected: BACKSPACE');
        return;
    }

    // 4. Check for Arrow Keys (Escape sequences starting with ESC [)
    if (key === '\u001b[A') { console.log('Key detected: UP ARROW'); return; }
    if (key === '\u001b[B') { console.log('Key detected: DOWN ARROW'); return; }
    if (key === '\u001b[C') { console.log('Key detected: RIGHT ARROW'); return; }
    if (key === '\u001b[D') { console.log('Key detected: LEFT ARROW'); return; }

    // 5. Check for Ctrl + [Letter] combinations (Ctrl+A is \u0001, Ctrl+Z is \u001a)
    const charCode = key.charCodeAt(0);
    if (charCode >= 1 && charCode <= 26 && key.length === 1) {
        const letter = String.fromCharCode(charCode + 96);
        console.log(`Key detected: CTRL + ${letter.toUpperCase()}`);
        return;
    }
*/
        
  return obj;
  
}//keysmod


