


/*

//file-server:d

12-08-25


*/


(()=>{

  var obj   = {
        version     : 'v1.0.0'
  };
  globalThis['file-server']    =  obj;
  
  
        var df    = false;
        Object.defineProperty(obj,'df',{set:v=>df=v});
        
        
  //:
  
  
        obj.url                 = null;
        obj.hdrs                = null;
        obj.auth                = null;
        
        
        
        obj.file                = {};
        obj.file.load           = loadfile;
        obj.file.load.txt       = loadfiletxt;
        obj.file.save           = savefile;
        obj.file.create         = mkfile;
        obj.file.delete         = rmfile;
        obj.file.del            = rmfile;
        obj.file.upload         = upload;
        obj.file.download       = download;
        
        
        obj.dir                 = {};
        obj.dir.read            = readdir;
        obj.dir.create          = mkdir;
        obj.dir.delete          = rmdir;
        obj.dir.del             = rmdir;
        obj.dir.clear           = dirclear;
        
        
        
        
  //:
  
  
        async function loadfile({url,hdrs,path}){
        
              if(arguments.length!=1){
                    [url,hdrs,path]   = arguments;
              }else{
                    if(typeof arguments[0]=='string'){
                          path    = arguments[0];
                    }
              }
              
              url     = url||obj.url;
              hdrs    = hdrs||obj.hdrs||{auth:obj.auth};
              
              var headers   = {mode:'load'};
              Object.assign(headers,hdrs);
              var full      = url+path;
              
              var err;
              try{
              
                    var res         = await fetch(full,{headers});
                    
              }
              catch(err2){
              
                    err   = err2;
                    
              }
              if(err){
                    var error   = err.toString();
                    return {error};
              }
              
              if(!res.ok){
                    var error   = await res.text();
                    return {error};
              }
              
              var blob    = await res.blob();
              return {blob};
              
        }//loadfile
        
        
        async function loadfiletxt(){
        
              var {blob,error}    = await loadfile.apply(null,arguments);
              if(error){
                    return {error};
              }
              var txt   = await blob.text();
              return {txt};
              
        }//loadfiletxt
        
        
        async function savefile({url,hdrs,path,blob}){
        
              if(arguments.length!=1){
                    if(arguments.length==2){
                          path    = arguments[0];
                          blob    = arguments[1];
                    }else{
                          [url,hdrs,path,blob]    = arguments;
                    }
              }
              
              url     = url||obj.url;
              hdrs    = hdrs||obj.hdrs||{auth:obj.auth};
              
              var headers   = {mode:'save'};
              Object.assign(headers,hdrs);
              var body      = blob;
              var full      = url+path;
              
              var err;
              try{
              
                    var res       = await fetch(full,{method:'post',headers,body});
                    
              }
              catch(err2){
              
                    err   = err2;
                    
              }
              if(err){
                    var error   = err.toString();
                    return  {error};
              }
              
              if(!res.ok){
                    var error   = await res.text();
                    return {error};
              }
              
              var ok    = await res.text();
              return {ok};
              
        }//save
        
        
        
        
        
        
        async function mkfile({url,hdrs,path}){
        
              if(arguments.length!=1){
                    [url,hdrs,path]   = arguments;
              }
              
              url     = url||obj.url;
              hdrs    = hdrs||obj.hdrs||{auth:obj.auth};
              
              var headers   = {mode:'mkfile'};
              Object.assign(headers,hdrs);
              var full      = url+path;
              
              var err;
              try{
              
                    var res       = await fetch(full,{headers});
                    
              }
              catch(err2){
              
                    err   = err2;
                    
              }
              if(err){
                    var error   = err.toString();
                    return {error};
              }
              
              if(!res.ok){
                    var error   = await res.text();
                    return {error};
              }
              
              var ok    = await res.text();
              return {ok};
              
        }//mkfile
        
        
        async function rmfile({url,hdrs,path}){
        
              if(arguments.length!=1){
                    [url,hdrs,path]   = arguments;
              }
              
              url     = url||obj.url;
              hdrs    = hdrs||obj.hdrs||{auth:obj.auth};
              
              var headers   = {mode:'rmfile'};
              Object.assign(headers,hdrs);
              var full      = url+path;
              
              var err;
              try{
              
                    var res       = await fetch(full,{headers});
                    
              }
              catch(err2){
              
                    err   = err2;
                    
              }
              if(err){
                    var error   = err.toString();
                    return {error};
              }
              
              if(!res.ok){
                    var error   = await res.text();
                    return {error};
              }
              var ok    = await res.text();
              return {ok};
              
        }//rmfile
        
        
        async function upload({url,hdrs,path,blob}){
        
              if(arguments.length!=1){
                    [url,hdrs,path,blob]    = arguments;
              }
              
              url     = url||obj.url;
              hdrs    = hdrs||obj.hdrs||{auth:obj.auth};
              
              var headers     = {mode:'upload'};
              Object.assign(headers,hdrs);
              var body        = blob;
              var full        = url+path;
              
              var err;
              try{
              
                    var res   = await fetch(full,{method:'post',headers,body});
                    
              }
              catch(err2){
              
                    err   = err2;
                    
              }
              if(err){
                    var error   = err.toString();
                    return {error};
              }
              
              
              if(!res.ok){
                    var error   = await res.text();
                    return {error};
              }
              
              var ok    = await res.text();
              return {ok};
              
        }//upload
        
        
        async function download({url,hdrs,path}){
        
              if(arguments.length!=1){
                    [url,hdrs,path]   = arguments;
              }
              
              url     = url||obj.url;
              hdrs    = hdrs||obj.hdrs||{auth:obj.auth};
              
              var headers     = {mode:'download'};
              Object.assign(headers,hdrs);
              var full        = url+path;
              
              var err;
              try{
              
                    var res         = await fetch(full,{headers});
                    
              }
              catch(err2){
              
                    err   = err2;
                    
              }
              if(err){
                    var error   = err.toString();
                    return {error};
              }
              
              if(!res.ok){
                    var error   = await res.text();
                    return {error};
              }
              
              var blob         = await res.blob();
              return {blob};
              
        }//download
        
        
  //:
  
  
        async function readdir({url,hdrs,path}){
        
              if(arguments.length!=1){
                    [url,hdrs,path]   = arguments;
              }
              
              url     = url||obj.url;
              hdrs    = hdrs||obj.hdrs||{auth:obj.auth};
              
              var headers     = {mode:'readdir'};
              Object.assign(headers,hdrs);
              var full        = url+path;
              
              var err;
              try{
              
                    var res         = await fetch(full,{headers});
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = err.toString();
                    return {error};
              }
              
              if(!res.ok){
                    var error   = await res.text();
                    return {error};
              }
              
              var txt             = await res.text();
              var json            = JSON.parse(txt);
              var {dirs,files}    = process(json);
                                                                                //debugger;
                                                                                //console.trace('readdir');
              return {dirs,files};
              
        }//readdir
        
        
        async function mkdir({url,hdrs,path}){
        
              if(arguments.length!=1){
                    [url,hdrs,path]   = arguments;
              }
              
              url     = url||obj.url;
              hdrs    = hdrs||obj.hdrs||{auth:obj.auth};
              
              var headers     = {mode:'mkdir'};
              Object.assign(headers,hdrs);
              var full        = url+path;
              
              var err;
              try{
              
                    var res         = await fetch(full,{headers});
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = err.toString();
                    return {error};
              }
              
              if(!res.ok){
                    var error   = await res.text();
                    return {error};
              }
              
              var ok    = await res.text();
              return {ok};
              
        }//mkdir
        
        
        async function rmdir({url,hdrs,path}){
        
              if(arguments.length!=1){
                    [url,hdrs,path]   = arguments;
              }
              
              url     = url||obj.url;
              hdrs    = hdrs||obj.hdrs||{auth:obj.auth};
              
              var headers     = {mode:'rmdir'};
              Object.assign(headers,hdrs);
              var full        = url+path;
              
              var err;
              try{
              
                    var res         = await fetch(full,{headers});
                    
              }
              catch(err2){
              
                    err   = err2;
                    
              }
              if(err){
                    var error   = err.toString();
                    return {error};
              }
              
              if(!res.ok){
                    var error   = await res.text();
                    return {error};
              }
              
              var ok    = await res.text();
              return {ok};
              
        }//rmdir
        
        
        
        
        
        function process(json){
        
              var {dirs,files}    = json;
              
              if(json.version){
                    switch(json.version){
                    
                      case 'c-v1'   : ({dirs,files}    = process.c.v1(json));       break;
                      
                    }//switch
              }
              
              return {dirs,files};
              
        }//process
        
        
        process.c   = {};
        
        process.c.v1    = function(json){
        
              var dirs    = [];
              var files   = [];
              
              var n       = json.list.length;
              
              for(var i=0;i<n;i+=2){
              
                    var fn      = json.list[i];
                    var type    = json.list[i+1];
                    
                    if(type=='file'){
                          files.push(fn);
                    }else{
                          dirs.push(fn);
                    }
                    
              }//for
              
              return {dirs,files};
              
        }//v1
        
        
        async function dirclear({url,hdrs,path}){
        
              if(arguments.length!=1){
                    [url,hdrs,path]   = arguments;
              }
              
              url     = url||obj.url;
              hdrs    = hdrs||obj.hdrs||{auth:obj.auth};
              
              var headers     = {mode:'dir-clear'};
              Object.assign(headers,hdrs);
              var full        = url+path;
              
              var err;
              try{
              
                    var res   = await fetch(full,{headers});
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = err.toString();
                    return {error};
              }
              
              if(!res.ok){
                    var error   = await res.text();
                    return {error};
              }
              
              var ok    = await res.text();
              return {ok};
              
        }//dirclear
        
        
        
        
        
  //:
  
  
  
  return obj;
  
})();

