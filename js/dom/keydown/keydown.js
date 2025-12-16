(()=>{
                                                                                  //console.log('keydown');
  var obj   = {
        version   : 'v1.0',
  };

        obj.bubbles   = {};
        
        var capture         = {};
        capture.stack       = [];
        capture.keydown     = kd(capture.stack,'capture');
        
        var bubbles         = {};
        bubbles.stack       = [];
        bubbles.keydown     = kd(bubbles.stack,'bubbles');

        
  //:

  
        obj.initdom   = function(){
        
              document.addEventListener('keydown',capture.keydown,true);
              document.addEventListener('keydown',bubbles.keydown,false);
              
        }//initdom
        
        
        obj.add   = function(fn){
        
              var i   = capture.stack.indexOf(fn);
              if(i!=-1)return;
              
              keydown.focus   = true;
              //keydown.stack.push(fn)
              capture.stack.unshift(fn);
              
        }//add
        

        obj.rem   = function(fn){
        
              var i   = capture.stack.indexOf(fn);
              if(i==-1)return;
              capture.stack.splice(i,1);
              
        }//rem
        

        obj.pop   = function(){
        
              capture.stack.pop()
              
        }//pop
        
        
        
        obj.bubbles.add   = function(fn){
                                                                                console.log('bubbles.add',fn);
              var i   = bubbles.stack.indexOf(fn);
              if(i==-1)return;
              
              bubbles.stack.unshift(fn);
              
        }//add
        
        
        obj.bubbles.rem   = function(fn){
                                                                                console.log('bubbles.rem',fn);
              var i   = bubbles.stack.indexOf(fn);
              if(i==-1)return;
              bubbles.stack.splice(i);
              
        }//rem


        
        
        function kd(stack,name){
          
              return keydown;
              
              
              function keydown(e){
                                                                                console.log('keydown',name);
                                                                                console.dir(stack);
                    var stop      = false;
                    var both      = false;
                    var prevent   = false;
                    
                    var result;
                    var fn;
                    
                    var n   = stack.length;
                    if(n==0){
                          return;
                    }
                    
                    var i   = n-1;
                    while(i!==null){
                    
                          fn        = stack[i];
                          result    = fn(e);
                          
                          if(datatype(result)=='object'){
                                break;
                          }
                          if(result===false){
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
      
                          var n   = stack.length;
                          for(var j=0;j<n;j++){
                          
                                if(stack[j]===fn){
                                      if(j==0){
                                            return null;
                                      }
                                      return j-1;
                                }
                                      
                          }//for
                          return null;
                          
                    }//prev
                    
              }//keydown
              
        }//kd


        
        function datatype(v){return Object.prototype.toString.call(v).slice(8,-1).toLowerCase()}


  return obj;

})();



