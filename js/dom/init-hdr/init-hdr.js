

        var mod   = create();

        function create(name){

              var mod         = {};
              mod.create      = create;
              mod.stack       = [];
              var ct          = 0;
              var total       = 0;
      
              
              Object.defineProperty(stack,'add',{
                    get:()=>{
                
                          total++;
                                                                                      if(mod.stack.df){
                                                                                            console.log('add',ct,total);
                                                                                      }
                    },//get
                    set:v=>{
              
                          total++;
                          stack.push(v);
                          
                    }//set
              });
              
              Object.defineProperty(stack,'complete',{get:()=>{
                
                    ct++;
                                                                                      if(mod.stack.df){
                                                                                            console.log('complete',ct,total);
                                                                                      }
                    if(ct!=total){
                          return;
                    }
                    
                    ct              = 0;
                    total           = 0;
                    
                    var list        = [...stack];
                    stack.length    = 0;
                    list.forEach(fn=>fn());
                    
              }});
      
        }//create
        
