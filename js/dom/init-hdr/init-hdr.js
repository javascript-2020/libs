



        var mod           = {};


        var stack         = [];
        stack.name        = '';
        stack.ct          = 0;
        stack.total       = 1;
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
              if(stack.ct>=stack.total){
              }
              
        }});


        
        //  (typeof stack!='undefined' && stack.add)
        //  (typeof stack!='undefined' && stack.complete)
        
        
        
