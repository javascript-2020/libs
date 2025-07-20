


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
        
        
        
  return obj;
  
}//keysmod


