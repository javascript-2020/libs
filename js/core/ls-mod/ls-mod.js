



function localstoragemod(){
  
  var obj   = {
  };
  
        var df=true,did='ls-mod'
        ;
  
  
        
        obj.initmod   = function(){
        }//initmod
        
        
  //vars:


        var prefix      = did;

        var build       = {};
        
        
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
                                                                                var df2=true;
              var loc         = window.location;
                                                                                df2 && debug('location',loc.toString());
              var base        = loc.protocol+'//'+location.host;
                                                                                df2 && debug('base',base);
              var path        = loc.pathname;
                                                                                df2 && debug('pathname',path);
              var i1          = 0;
              if(path.startsWith('/')){
                    i1        = 1;
              }
              var i2          = path.lastIndexOf('/');
              path            = path.slice(i1,i2);
                                                                                df2 && debug('path',path);
              var parts       = path.split('/');
                                                                                df2 && debug('parts',parts);
              var np          = parts.length;
              np             -= n;           
              path            = '/'+parts.slice(0,np)+'/';
                                                                                df2 && debug('path',path);
              base           += path;
                                                                                df2 && debug('base',base);
              return base;
              
        }//dir
        

  //:
  
  
        function fn(params={}){
                                                                                debug('fn');
              var {type='file',n}   = params;
              
              var fn;
              var params;
                                                                                debug(type);
              switch(type){
                
                case 'file'   : fn    = build.file;           
                                                                break;
                case 'dir'    : fn    = build.dir;
                                        params    = {n};        
                                                                break;                                                        
              }//switch
              
              //debugger;
              var base    = fn.call(null,params);
              return base;
              
        }//fn
        
        
        fn.read   = function(params){
                                                                                debug('read');
              var base    = fn(params);
                                                                                debug(base);
              return get;
              
              
              function get(target,prop,receiver){
                
                    var full    = `${prefix}[${base}]${prop}`;
                    var str     = localStorage[full];
                    if(str===null){
                          var error   = prop+' not found';
                          return {error};
                    }
                    var value   = JSON.parse(str);
                                                                                debug('read',full,value);
                    return {value};
                    
              }//get
          
        }//read
        
        
        fn.write    = function(params){
                                                                                debug('write');
              var base    = fn(params);              
                                                                                debug(base);
              return set;
              
              
              function set(obj,prop,value){
                
                    var {str,error}   = stringify(value);
                    if(error){
                          return {error};
                    }
                    
                    var full              = `${prefix}[${base}]${prop}`;
                                                                                debug('write',full,str);
                    localStorage[full]    = str;
                    return {ok:'ok'};
                    
              }//set
          
        }//write
        
        
        fn.delete   = function(params){
                                                                                debug('delete');
              var base    = fn(params);
                                                                                debug(base);
              return get;

              
              function get(target,prop,receiver){
                
                    var full    = `${prefix}[${base}]${prop}`;
                    
                    var str     = localStorage[full];
                    if(str===null){
                          var error   = prop+' not found';
                          return {error};
                    }
                                                                                debug('delete',full);
                    localStorage.removeItem(full);
                    return {ok:'ok'};
                    
              }//get
              
        }//delete
        

        fn.clear    = function(params){
                                                                                debug('clear');
              var base    = fn(params);
                                                                                debug(base);
              var list    = [];
              var n       = localStorage.length;
              for(var i=0;i<n;i++){
                
                    var key   = localStorage.key(i);
                    if(key.startsWith(`${prefix}[${base}]`)){
                                                                                debug('remove',key);
                          localStorage.removeItem(key);
                          list.push(key);
                    }
                    
              }//for
          
        }//clear
        
        
  //:
  
        
        
        obj.read      = new Proxy({},{get:fn.read()});
        obj.write     = new Proxy({},{set:fn.write()});
        obj.delete    = new Proxy({},{get:fn.delete()});
        obj.clear     = function(){return fn.clear()};
          
        
  //:
  
  
        obj.grp   = function(n=0){
                                                                                debug('grp',n);
              return {
                    read      : new Proxy({},{get:fn.read({type:'dir',n})}),
                    write     : new Proxy({},{set:fn.write({type:'dir',n})}),
                    delete    : new Proxy({},{get:fn.delete({type:'dir',n})}),
              };
              
        }//grp


  //:
  
  
        obj.list    = function(name,disp=true){
          
              var list    = [];
              var n       = localStorage.length;
                                                                                debug('list',n);
              for(var i=0;i<n;i++){
                
                    var key   = localStorage.key(i);
                    
                    if(key.startsWith(prefix)){
                          if(name){
                                var i     = key.indexOf(']');
                                key       = key.slice(i+1);
                          }
                          if(disp){
                                                                                console.log(i,key);
                          }else{
                                                                                debug(i,key);
                          }
                          list.push(key);
                    }
                    
              }//for
              return list;
              
        }//list
        
        
        obj.list.pages    = function(disp=true){
                                                                                debug('list.pages');
              var list    = [];
              var n       = localStorage.length;
              for(var i=0;i<n;i++){
                
                    var key     = localStorage.key(i);
                    
                    if(key.startsWith(prefix)){
                          var i1      = key.indexOf('[');
                          var i2      = key.indexOf(']');
                          var page    = key.slice(i1+1,i2);
                          
                          if(!list.includes(page)){
                                if(disp){
                                                                                console.log(page);
                                }else{
                                                                                debug(page);
                                }
                                list.push(page);
                          }
                    }
                    
              }//for
              return list;
              
        }//pages
        
        
        obj.list.all    = function(disp=true){
          
              var list    = [];
              var n       = localStorage.length;
              for(var i=0;i<n;i++){
              
                    var key   = localStorage.key(i);  
                    if(disp){
                                                                                console.log(i,key);
                    }else{
                                                                                debug(i,key);
                    }
                    
              }//for
              
        }//all
        
        
        obj.reset    = function(disp=true){
                                                                                debug('reset');
              var list    = [];
              var n       = localStorage.length;
              for(var i=0;i<n;i++){
                
                    var key     = localStorage.key(i);
                    if(key.startsWith(prefix)){
                          if(disp){
                                                                                console.log(key);
                          }else{
                                                                                debug(key);
                          }
                          list.push(key);
                          localStorage.removeItem(key);
                    }
                    
              }//for
              return list;
              
        }//reset
        
        
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


