

(()=>{

  var obj    =  debug;


  //:

  
        function debug(){
          
              if(!df)return;
              
              var id    = 'html';
              if(typeof debug_id!='undefined'){
                    id    = debug_id;
              }
              if(typeof did!='undefined'){
                    id    = did;
              }
              
              var str   = [...arguments].join(' ');
              
              console.groupCollapsed(`[ ${id} ]`,str);
              console.trace();
              console.groupEnd();
              
              //console.log(`[ ${id} ]`,str);

/*              
              if(debug._trace){
                    console.trace();
              }
              delete debug._trace;
*/              
              
        }//debug
        
        
        debug.log   = function(){debug.apply(null,arguments)}

        
        debug.trace   = function(){
          
              debug._trace   = true;
              debug.apply(null,arguments);
              
        }//trace



    return obj;

  //debug:-

  
})();






