



        var mod           = {};


        var stack         = [];
        stack.name        = '';
        stack.ct          = 0;
        stack.total       = 0;
        stack.df          = false;

        
        Object.defineProperty(stack,'add',{
              get:()=>{
          
                    stack.total++;
                                                                                if(stack.df){
                                                                                      console.log('add',stack.ct,stack.total);
                                                                                }
              },//get
              set:v=>{
        
                    stack.total++;
                    stack.push(v);
                    
              }//set
        });
        
        Object.defineProperty(stack,'complete',{get:()=>{
          
              stack.ct++;
                                                                                if(stack.df){
                                                                                      console.log('complete',stack.ct,stack.total);
                                                                                }
              if(stack.ct<stack.total){
                    return;
              }
              
              stack.ct        = 0;
              stack.total     = 0;
              var list        = [...stack];
              stack.length    = 0;
              list.forEach(fn=>fn());
              
        }});


        
        //  (typeof stack!='undefined' && stack.add)
        //  (typeof stack!='undefined' && stack.complete)
        
        
        
