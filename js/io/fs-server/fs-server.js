


/*

//fs-server:d

12-08-25


*/


(()=>{
  
  var obj   = {};
  
  
  //:
  
  
  
        obj.load    = async function(url,hdrs,path){
          
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
                    alert('https-file.loadfile error\n'+err.toString());
                    return;
              }
              
              if(!res.ok){
                    var txt         = await res.text();
                    alert('loadfile : '+url+'\n'+txt);
                    return false;
              }
              
              var blob    = await res.blob();
              return blob;
              
        }//loadfile
        
        
        obj.save    = async function(url,hdrs,path,blob){
          
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
                    alert('https-file.savefile error\n'+err.toString());
                    return;
              }
              
              if(!res.ok){
                    var txt       = await res.text();
                    alert('savefile : '+url+'\n'+txt);
                    return false;
              }
              
              var blob    = await res.blob();
              return blob;
              
        }//save
        



  
        
        obj.mkfile   = async function(url,hdrs,path){

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
        
        
        obj.rmfile   = async function(url,hdrs,path){
          
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
        
        
        obj.rmdir    = async function(url,hdrs,path){
          
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
        
        
        obj.mkdir    = async function(url,hdrs,path){

              var headers     = {mode:'mkdir'};
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

        
        obj.readdir    = async function(url,hdrs,path){

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
                    var str   = err.toString();
                    alert(`fetch error\n${str}`);
                    return;
              }
              
              var txt         = await res.text();
              
              if(!res.ok){
                    alert('readdir :'+url+'\n'+txt);
                    return false;
              }
              
              var json            = JSON.parse(txt);
              var {dirs,files}    = process(json);
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


        obj.upload   = async function(url,hdrs,path,blob){

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
        
        
        obj.download   = async function(url,hdrs,path){
          
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
                    var str   = err.toString();
                    alert(`fetch error\n${str}`);
                    return false;
              }
              
              if(!res.ok){
                    var txt   = await res.text();
                    alert('readdir :'+url+'\n'+txt);
                    return false;
              }
              
              var blob         = await res.blob();
              return blob;
          
        }//download
        
        
        obj.dirclear   = async function(url,hdrs,path){
          
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


  
  
  
  //:
  
  
  
  return obj;
  
})();
