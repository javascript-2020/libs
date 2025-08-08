


(()=>{

  var obj   = {};
  
  
        obj.sandbox   = sandbox;
        
        
        function sandbox(js,{clear,disp_result}={}){
          
              (()=>{

                    if(clear){
                          cons.clear();
                    }

                    
                    var console     = {};
                    console.log     = function(){
                                    
                                            dconsole.log.apply(null,arguments);
                                            window.console.log.apply(window.console,arguments);
                                          
                                      }//log
                    console.clear   = function(){
                        
                                            dconsole.clear();
                                            window.console.clear();
                                            
                                      }//clear

                                    
                    var result    = eval(js);
                    
                    if(disp_result){
                          dconsole.log('result :',result);
                    }
                    
              })();
              
        }//sandbox

  
  
  return obj;


})();



