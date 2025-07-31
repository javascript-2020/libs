


debug;


        function debug(){
          
              if(!df)return;
              var str   = [...arguments].join(' ');
              console.log('[ https-file ]',str);
              
        }//debug
        
        
        debug.log   = function(){
          
              if(!df)return;
              
              console.log.apply(console,arguments);
              
              if(debug.trace){
                    console.trace();
              }
              delete debug.trace;
              
        }//log
        
        
        debug.log.trace   = function(){
          
              debug.trace   = true;
              debug.log.apply(null,arguments);
              
        }//trace




