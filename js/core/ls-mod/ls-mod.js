



function localstoragemod(){
  
  var obj   = {
  };
  
        var df=true,did='ls-mod'
        ;
  
  
        
        obj.initmod   = function(){
        }//initmod
        
        
  //vars:



        var fn          = {};
        var build       = {};
        
        
  //:
  
  
        function fn(params={}){
          
              var {type='file'}   = params;
              
              var fn;
              var params;
              
              switch(type){
                
                case 'file'   : fn    = build.file;           
                                                                break;
                case 'dir'    : fn    = build.dir;
                                        params    = {n};        
                                                                break;                                                        
              }//switch
              
              var base    = fn.call(null,args);
              return base;
              
        }//fn
        
        
        fn.read   = function(params){
          
              var base    = fn(params);
              return get;
              
              
              function get(target,prop,receiver){
                
                    var full    = `[${base}]${prop}`;
                    var str     = localStorage[full];
                    if(str===null){
                          var error   = 'not found';
                          return {error};
                    }
                    var value   = JSON.parse(str);
                    return {value};
                    
              }//get
          
        }//read
        
        
        fn.write    = function(params){
          
              var base    = fn(params);              
              return set;
              
              
              function set(obj,prop,value){
                
                    var {str,error}   = stringify(value);
                    if(error){
                          return {error};
                    }
                    
                    var full              = `[${base}]${prop}`;
                    localStorage[full]    = str;
                    return {ok:'ok'};
                    
              }//set
          
        }//write
        
        
        fn.delete   = function(params){
          
              var base    = fn(params);
              return get;

              
              function get(target,prop,receiver){
                
                    var full    = `[${base}]${prop}`;
                    
                    var str     = localStorage[full];
                    if(str===null){
                          var error   = 'not found';
                          return {error};
                    }
                    localStorage.removeItem(full);
                    return {ok:'ok'};
                    
              }//get
              
        }//delete
        

        fn.clear    = function(params){
        }//clear
        
        
  //:
  
        
        
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

        
        obj.write   = new Proxy({},{set:fn.write()});
        obj.read    = new Proxy({},{get:fn.read()});
        obj.delete    = new Proxy({},{get:fn.delete()};
          

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
  
  
        build.file    = function(){
          
              var base    = window.location.toString();
              var i       = base.indexOf('?');
              if(i!=-1){
                    base    = base.slice(0,i);
              }
              return base;
          
        }//file

        
        build.dir   = function(n=0){
          
              var loc         = window.location;
              var base        = loc.protocol+'//'+location.host;
              var path        = loc.pathname;
              var i1          = 0;
              if(path.startsWith('/')){
                    i1        = 1;
              }
              var i2          = path.lastIndexOf('/');
              path            = path.slice(i1,i2);
              var parts       = path.split('/');
              var np          = parts.length;
              np             -= n;           
              path            = '/'+parts.slice(0,n)+'/';
              base           += path;
              return base;
              
        }//dir
        
        
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


