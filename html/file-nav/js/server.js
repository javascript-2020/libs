


(()=>{



        var server      = {
              version   : 'v1.0.0'
        };
        
        
        
        server.mkfile   = async function(url,auth,path){

              var headers   = {mode:'mkfile',auth};
              var full      = url+path;

              var err;
              try{
                
                    var res       = await fetch(full,{headers});
                    
              }
              catch(err2){
                
                    err   = err2;
                    
              }
              if(err){
                    var str   = err.toString();
                    alert(`fetch error\n${str}`);
                    return;
              }
              
              var txt       = await res.text();
              
              if(!res.ok){
                    alert(`mkfile : ${path}\n${txt}`);
                    return;
              }
              return true;
              
        }//mkfile
        
        
        server.rmfile   = async function(url,auth,path){
          
              var headers   = {mode:'rmfile',auth};
              var full      = url+path;
              
              var err;
              try{
                
                    var res       = await fetch(full,{headers});
                    
              }
              catch(err2){
                
                    err   = err2;
                    
              }
              if(err){
                    var str   = err.toString();
                    alert(`fetch error\n${str}`);
                    return;
              }
              
              var txt       = await res.text();
              
              if(!res.ok){
                    alert(`rmfile : ${path}\n${txt}`);
                    return;
              }
              
              return true;
              
        }//rmfile
        
        
        server.rmdir    = async function(url,auth,path){
          
              var headers     = {mode:'rmdir',auth};              
              var full        = url+path;
              
              var err;
              try{
                
                    var res         = await fetch(full,{headers});
                    
              }
              catch(err2){
                
                    err   = err2;
                    
              }
              if(err){
                    var str   = err.toString();
                    alert(`fetch error\n${str}`);
                    return;
              }
              
              var txt         = await res.text();
              
              if(!res.ok){
                    alert(`rmdir : ${path}\n${txt}`);
                    return;
              }
              
              return true;
              
        }//rmdir
        
        
        server.mkdir    = async function(url,auth,path){

              var headers     = {mode:'mkdir',auth};
              var full        = url+path;
              
              var err;
              try{
                
                    var res         = await fetch(full,{headers});
                    
              }
              catch(err2){
                
                    err   = err2;
                    
              }
              if(err){
                    var str   = err.toString();
                    alert(`fetch error\n${str}`);
                    return;
              }
              
              var txt         = await res.text();
              
              if(!res.ok){
                    alert(`mkdir : ${path}\n${txt}`);
                    return false;
              }
              
              return true;
              
        }//mkdir

        
        server.readdir    = async function(url,auth,path){

              var headers     = {mode:'readdir',auth};
              var full        = url+path;

              var err;
              try{
              
                    var res         = await fetch(full,{headers});
                    
              }
              catch(err2){
                
                    err   = err2;
                    
              }
              if(err){
                    var str   = err.toString();
                    alert(`fetch error\n${str}`);
                    return;
              }
              
              var txt         = await res.text();
              
              if(!res.ok){
                    alert('readdir :'+url+'\n'+txt);
                    return false;
              }
              
              var json    = JSON.parse(txt);
              
              var {dirs,files}   = process(json);
                                                                                //debugger;
                                                                                //console.trace('readdir');
              display(path,dirs,files);
              return true;
              
        }//readdir


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
              
              var n   = json.list.length;
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


        server.upload   = async function(url,auth,path,blob){

              var headers     = {mode:'upload',auth};
              var body        = blob;
              var full        = url+path;

              var err;
              try{
              
                    var res         = await fetch(full,{method:'post',headers,body});
                    
              }
              catch(err2){
                
                    err   = err2;
                    
              }
              if(err){
                    var str   = err.toString();
                    alert(`fetch error\n${str}`);
                    return;
              }
              
              var txt         = await res.text();
              
              if(!res.ok){
                    alert('readdir :'+url+'\n'+txt);
                    return false;
              }
          
        }//upload
        
        
        server.download   = async function(url,auth,path){
          
              var headers     = {mode:'download',auth};
              var full        = url+path;

              var err;
              try{
              
                    var res         = await fetch(full,{headers});
                    
              }
              catch(err2){
                
                    err   = err2;
                    
              }
              if(err){
                    var str   = err.toString();
                    alert(`fetch error\n${str}`);
                    return false;
              }
              
              if(!res.ok){
                    var txt   = await res.text();
                    alert('readdir :'+url+'\n'+txt);
                    return false;
              }
              
              var blob         = await res.blob();console.log(blob);
              return blob;
          
        }//download
        
        
        server.dirclear   = async function(url,auth,path){
          
              var headers     = {mode:'dir-clear',auth};
              var full        = url+path;

              var err;
              try{
              
                    var res         = await fetch(full,{headers});
                    
              }
              catch(err2){
                
                    err   = err2;
                    
              }
              if(err){
                    var str   = err.toString();
                    alert(`fetch error\n${str}`);
                    return;
              }
              
              if(!res.ok){
                    var txt   = await res.text();
                    alert('readdir :'+url+'\n'+txt);
                    return false;
              }

              return true;
              
        }//dirclear



        
        
        return server;
        
})();


