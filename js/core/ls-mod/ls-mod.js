



function localstoragemod(){
  
  var obj   = {
  };
  
        var df=true,did='ls-mod'
        ;
  
  
        
        obj.initmod   = function(){
        }//initmod
        
        
  //vars:

  
        var base    = window.location.toString();
        var i       = base.indexOf('?');
        if(i!=-1){
              base    = base.slice(0,i);
        }
        
        
        obj.grp   = function(n=0){
          
              return {
                
                    read    : new Proxy({},{
                    }),
                    
                    write   : new Proxy({},{
                    }),
                    
                    delete    : new Proxy({},{
                    }),
                    
              };
              
        }//grp
        
        obj.write   = new Proxy({},{
          
              set(obj,prop,value){
                
                    var {str,error}   = stringify(value);
                    if(error){
                          return {error};
                    }
                    
                    var full              = `[${base}]${prop}`;
                    localStorage[full]    = str;
                    return {ok:'ok'};
                    
              }//set
              
        });
        
        
        obj.read    = new Proxy({},{
          
              get(target,prop,receiver){
                
                    var full    = `[${base}]${prop}`;
                    var str     = localStorage[full];
                    if(str===null){
                          var error   = 'not found';
                          return {error};
                    }
                    var value   = JSON.parse(str);
                    return {value};
                    
              }//get
              
        })//read
        
        
        obj.delete    = new Proxy({},{
          
              get(target,prop,receiver){
                
                    var full    = `[${base}]${prop}`;
                    
                    var str     = localStorage[full];
                    if(str===null){
                          var error   = 'not found';
                          return {error};
                    }
                    localStorage.removeItem(full);
                    return {ok:'ok'};
                    
              }//get
              
        })//delete


        obj.clear   = function(){
          
              var list    = [];
              var n       = localStorage.length;
              for(var i=0;i<n;i++){
                
                    var key   = localStorage.key(i);
                    if(key.startsWith(`[${base}]`)){
                          localStorage.removeItem(key);
                          list.push(key);
                    }
                    
              }//for

        }//clear
        
        
        obj.list    = function(name){
          
              var list    = [];
              var n       = localStorage.length;
                                                                                debug('list',n);
              for(var i=0;i<n;i++){
                
                    var key   = localStorage.key(i);
                    if(name){
                          var i   = key.indexOf(']');
                          key     = key.slice(i+1);
                    }
                                                                                debug(i,key);
                    list.push(key);
                    
              }//for
              return list;
              
        }//list
        
        
        obj.list.pages    = function(){
                                                                                debug('list.pages');
              var list    = [];
              var n       = localStorage.length;
              for(var i=0;i<n;i++){
                
                    var key     = localStoreage.key(i);
                    var i       = key.indexOf(']');
                    var page    = key.slice(1,i);
                    
                    if(!list.includes(page)){
                                                                                debug(page);
                          list.push(page);
                    }
                    
              }//for
              return list;
              
        }//pages
        
        
        obj.format    = function(){
                                                                                debug('format');
              var list    = [];
              var n       = localStorage.length;
              for(var i=0;i<n;i++){
                
                    var key     = localStoreage.key(i);
                    list.push(key);
                    localStorage.removeItem(key);
                    
              }//for
              return list;
              
        }//format
        

  //:
  
  
        function stringify(value){
          
              var err;
              try{
                
                    var str   = JSON.stringify(value);
                    
              }//try
              catch(err2){
                
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = err.toString();
                    return {error};
              }
              
              return {str};
              
        }//stringify
        
  
  //:
  

        function debug(...args){
          
              if(!df && !obj.df)return;
              args.unshift(`[ ${did} ]`);
              var fmt     = Array.from({length:args.length}).fill('%O').join(' '); 
              var args2   = [fmt].concat(args);
              console.groupCollapsed.apply(console,args2);
              console.trace();
              console.groupEnd();
              
        }//debug


  
  return obj;
  
//localstoragemod
}


