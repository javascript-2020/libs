(()=>{

                                                                                  //console.log('keydown');
                                                                                  
        keydown.stack   = [];
        
        
        keydown.initdom   = function(){
        
              document.addEventListener('keydown',keydown,true);
              
              
        }//initdom
        
        
        keydown.add   = function(fn){
        
              var i   = keydown.stack.indexOf(fn);
              if(i!=-1)return;
              
              keydown.focus   = true;
              keydown.stack.push(fn)
              
        }//add
        

        keydown.rem   = function(fn){
        
              var i   = keydown.stack.indexOf(fn);
              if(i==-1)return;
              keydown.stack.splice(i,1);
              
        }//rem
        

        keydown.pop   = function(){
        
              keydown.stack.pop()
              
        }//pop

        
        function keydown(e){
                                                                                //console.log(e.key);
                                                                                var str   = 'keydown';
              var stop      = false;
              var both      = false;
              var prevent   = false;
              
              var result;
              var fn;
              var n   = keydown.stack.length;
              if(n==0){
                    return;
              }
              var i   = n-1;
              while(i!==null){
              
                    fn        = keydown.stack[i];
                    result    = fn(e);
                    if(result!==false){
                          break;
                    }
                    i   = prev();
                    
              }//while
              
              
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

              
              function prev(){

                    var n   = keydown.stack.length;
                    for(var j=0;j<n;j++){
                    
                          if(keydown.stack[j]===fn){
                                if(j==0){
                                      return null;
                                }
                                return j-1;
                          }
                                
                    }//for
                    return null;
                    
              }//prev
              
        }//keydown



        return keydown;

})();



