

(()=>{

  var obj    =  debug;



  
        //var debug_id='';



  //:

  
        function debug(){
          
              if(!df)return;
              var str   = [...arguments].join(' ');
              var id='not set';
              if(typeof debug_id!='undefined'){
                    id    = debug_id;
              }
              console.log(`[ ${id} ]`,str);
              
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




  
    return obj;

  //debug:-

  
})();






