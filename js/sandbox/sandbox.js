


(()=>{

  var obj   = {};
  
  
        obj.run   = run;
        
        
        function run(js,{clear,disp_result,console,ctx}={}){


              ctx   ||= {};

          
              eval(`
              
                    (()=>{
                    
                          ({${Object.keys(ctx).join(',')}}    = ctx);
                          
                          if(clear){
                                console.clear();
                          }
      
                          var result    = eval(js);
                          
                          if(disp_result){
                                dconsole.log('result :',result);
                          }
                          
                    })();
              
              `);

              
        }//sandbox

  
  
  return obj;


})();



