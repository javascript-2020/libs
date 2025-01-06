(()=>{

        keydown.initdom=function(){
        
              document.addEventListener('keydown',keydown,true);
              
              
        }//initdom
        
        
        keydown.stack   = [];
        
        keydown.add=function(fn){
        
              var i   = keydown.stack.indexOf(fn);
              if(i!=-1)return;
              
              keydown.focus   = true;
              keydown.stack.push(fn)
              
        }//add
        
        keydown.rem=function(fn){
        
              var i   = keydown.stack.indexOf(fn);
              if(i==-1)return;
              keydown.stack.splice(i,1);
              
        }//rem
        
        keydown.pop=function(){
        
              keydown.stack.pop()
              
        }//pop
        
        function keydown(e){console.log(e.key);
                                                                                var str   = 'keydown';
              var stop      = false;
              var both      = false;
              var prevent   = false;
              
              var result;
              var n   = keydown.stack.length;
              for(var i=n-1;i>=0;i++){
              
                    var fn    = keydown.stack[i];
                    result    = fn(e);
                    if(result!==false){
                          break;
                    }
                    
              }//for
              
              
              if(result){
                    ({stop,prevent,both}   = result);
              }
                                                                                //console.log(str,stop,prevent,both);
              if(stop || both){
                    e.stopPropagation();
              }
              if(prevent || both){
                    e.preventDefault();
              }
              
        }//keydown

        return keydown;

})();



