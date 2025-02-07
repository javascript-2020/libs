


/*

//keydown:d

07-02-25

*/


function keydownmod(){

  var obj   = {};
  
      var df=true
            
                                                                                  debug('keydown');

  //vars:-
  
      var stack   = [];


  //:
  
      obj.initdom=function(doc){
        
            doc   = doc||document;
            
            doc.addEventListener('keydown',keydown,true);
              
              
      }//initdom
        
              
      obj.add=function(fn){
      
            var i   = stack.indexOf(fn);
            if(i!=-1)return;
            
            obj.focus   = true;
            stack.push(fn)
            
      }//add

        
      obj.rem=function(fn){
      
            var i   = stack.indexOf(fn);
            if(i==-1)return;
            stack.splice(i,1);
            
      }//rem

      
      obj.pop=function(){
      
            stack.pop()
            
      }//pop

      
      function keydown(e){
                                                                              //console.log(e.key);
                                                                              var str   = 'keydown';
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


  //:

  
      function debug(){
      
            if(!df)return;
            
            var str   = [...arguments].join(' ');
            console.log(str);
            
      }//debug
      
      
  return obj;

//keydownmod:-  
}



