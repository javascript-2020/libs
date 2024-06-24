        
        
        function modproxy(notfound){
              
              var mem     = {};          
              return newproxy();

              
              function getter(target,name,receiver,lname){
                    
                    lname && (lname   += '.');
                    lname  += name;
                    
                    if(lname in mem){
                          var v   = mem[lname];
                                                                                log(`rd : ${lname} - ${v}`);
                          return v;
                    }
                    
                    return newproxy(()=>{},lname);
              
              }//getter

              
              function setter(target,name,newval,lname){
              
                    lname && (lname   += '.');
                    lname  += name;
                                                                                log(`wt : ${lname} - ${newval}`);
                    mem[lname]    = newval;
                              
              }//setter

              
              function applyer(target,thisArg,args,lname){
                    
                    if(lname in mem){
                          var v   = mem[lname];
                          if(typeof v=='function'){
                                                                                log(`fn : ${lname} - [${args}]`);
                                return v.apply(thisArg,args);
                          }
                          return v;
                    }
                                                                                log(`fn (not found): ${lname} - [${args}]`);                              
                    var result    = notfound(lname,args);
                    return result;
                    
              }//applyer

              
              function newproxy(target=()=>{},lname=''){
              
                    return new Proxy(target,{
                          get (target,name,receiver)=>getter(target,name,receiver,lname),
                          set (target,name,newval)=>setter(target,name,newval,lname),
                          apply (target,thisArg,args)=>applyer(target,thisArg,args,lname)
                    });
              
              }//proxy
        
              
              function log(){
                    
                    if(modproxy.df!==true)return;
                    if(typeof modproxy.log==='function')return modproxy.log.apply(null,arguments);
                    if(modproxy.log!==undefined)return;
                    console.log.apply(null,arguments);
                    
              }//log
              
        }//modproxy
        
        
