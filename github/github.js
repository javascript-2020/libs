


/*

//libs/github/github.js:d

19-05-25


`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`

`https://api.github.com/repos/${owner}/${repo}/contents/${path}`
{authorization:`Bearer ${token}`}


*/


(()=>{


        var github            = {};
        github.version        = 'v1.0.0';

        var download          = {};
        var upload            = {};
        var get               = {};
        parse.is              = {};
        
        
  //:

        
        setTimeout(init,50);
        
        function init(){
        
              github.df             = true;
              
              github.parse          = parse;  
              github.load           = load;
              github.save           = save;
              github.backup         = backup;
              github.download       = download;

              
        }//init
  
        
  //:
  
  
        function parse(url){
        
              url   = window.decodeURIComponent(url);
              
              if(!url.startsWith('http')){
                    url   = 'https://'+url;
              }

              
              var err;
              
              try{
              
                    url   = new URL(url);
                    
              }//try
              
              catch(err2){
              
                    err   = err2;
                  
              }//catch
              
              if(err){
                    return {error:err};
              }

              
              var result;
              
              if(url.hostname=='javascript-2020.github.io'){
                    result    = parse['github.io'](url);
              }
              
              if(url.hostname=='github.com'){
                    if(url.pathname.indexOf('blob')!=-1){
                          result    = parse.file(url);
                    }else 
                    if(url.pathname.indexOf('tree')!=-1){
                          result    = parse.dir(url);
                    }else{
                          result    = parse.repo(url);
                    }
              }
                    
              if(result){
                    return result;
              }
              
              return {error:'unrecognised url format'};
              
        }//parse

                                                                                //  https://javascript-2020.github.io/html-components/log/log.html
        parse['github.io']    = function(url){
                                                                                debug('github.io');
              var i         = url.hostname.indexOf('.');
              var owner     = url.hostname.slice(0,i);
              var repo      = url.hostname;
              var branch    = 'main';
              var path      = url.pathname.slice(1);
              return {owner,repo,branch,path};
              
        }//github.io
        
                                                                                //  https://github.com/javascript-2020/libs
        parse.repo    = function(url){
                                                                                debug('repo');
              var parts     = url.pathname.split('/');
              var owner     = parts.shift();
              var repo      = parts.shift();
              var branch    = 'main';
              var path      = '';
              return {owner,repo,branch,path};
              
        }//repo

                                                                                //  https://github.com/javascript-2020/libs/blob/main/docker/nodejs-min.dockerfile
        parse.file    = function(url){
                                                                                debug('file');
              var parts     = url.pathname.split('/');
              parts.shift();
              var owner     = parts.shift();
              var repo      = parts.shift();
              parts.shift();
              var branch    = parts.shift();
              var path      = parts.join('/');
              return {owner,repo,branch,path};
        
        }//file
        
                                                                                //  https://github.com/javascript-2020/libs/tree/main/docker
        parse.dir   = function(url){
                                                                                debug('dir');
              var parts     = url.pathname.split('/');
              parts.shift();
              var owner     = parts.shift();
              var repo      = parts.shift();
              parts.shift();
              var branch    = parts.shift();
              var path      = parts.join('/');
              return {owner,repo,branch,path};
              
        }//dir

        
        parse.is.api    = function(url){
        
              if(url.includes('api.github.com')){
                    return true;
              }
              return false;
              
        }//api
        
        
        parse.is.raw    = function(url){
        
              if(url.includes('raw.githubusercontent.com')){
                    return true;
              }
              return false;

        }//raw
        
        
  //:        


        function build(api,token,owner,repo,branch,path){

              if(arguments.length==1){
                    var o   = arguments[0];
                    var {api,token,owner,repo,branch,path}    = o;
              }
              
              var url   = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
              var headers;
              if(api){
                    if(!token){
                          token     = localStorage.getItem('github-token');
                    }
                    if(token){
                          headers   = {authorization:`Bearer ${token}`};
                    }
                    url             = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;                                
              }                          
              return url;

        }//build
        
        
  //:
  

        function load({token,owner,repo,branch,path}){
        
              var result;
              if(token){
                    result    = load.api(token,owner,repo,branch,path);
              }else{
                    result    = load.raw(owner,repo,branch,path);
              }
              return result;
              
        }//load
        
        
        load.raw    = async function(owner,repo,branch,path){
        
              var url   = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
                                                                                debug('load.raw',url);
                                                                                
              var err;
              
              try{
              
                    var res   = await fetch(url);
                    
              }//try
              
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              
              if(err){
                    return {error:err};
              }

              if(!res.ok){
                    var txt   = await res.text();
                    return {error:txt};
              }
              
              var blob    = await res.blob();
              
              return {ok:blob};
              
        }//raw
        
        
        load.api    = async function(token,owner,repo,branch,path){

              var url       = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;                                
              var headers   = {authorization:`Bearer ${token}`};
                                                                                debug('load',url);
                                                                                
              var err;
              
              try{
              
                    var res   = await fetch(url,{headers});
                    
              }//try
              
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              
              if(err){
                    return {error:err};
              }

              if(!res.ok){
                    var error   = await res.text();
                    return {error};
              }
              
              var json    = await res.json();
              var blob    = await b64_blob(json.content);
              
              return {ok:blob};
              
        }//api


  //:
  
  
        async function save(token,owner,repo,branch,path,blob){
        
              var b64;
              if(datatype(blob)=='string'){
                    b64       = window.btoa(blob);
              }else{
                    b64       = await blob_b64(blob);
              }
              
              
              var headers     = {authorization:`Bearer ${token}`};
              var url         = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

              
              var err;
              
              try{
              
                    var json        = await fetch(url,{headers}).then(res=>res.json());
                    
              }//try
              
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              
              if(err){
                    return {error:err};
              }

              
              var sha         = json.sha;
              
              var content     = b64;
              var message     = 'save file';
              var body        = {content,sha,message};
              body            = JSON.stringify(body);
              var headers     = {authorization:`Bearer ${token}`};
              var opts        = {method:'put',headers,body};

              
              var err;
              
              try{
              
                    var res         = await fetch(url,opts);
                    
              }//try
              
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              
              if(err){
                    return {error:err};
              }
              
              
              if(!res.ok){
                    var txt         = await res.text();
                    return {error:txt};
              }
                                                                                debug('saved');
              var ok   = await res.text();
              return {ok};
              
        }//save
        

        async function backup(token,owner,repo,branch,path){
                                                                                debug('backup',path);
              var result    = await load.api(token,owner,repo,branch,path);
              if(result.error){
                    return result;
              }
              var blob    = result.ok;
              var txt     = await blob.text();
              
              var fn;
              var i   = path.lastIndexOf('/');
              
              if(i==-1){
                    fn      = path;
                    path    = '';
              }else{
                    fn      = path.slice(i+1);
                    path    = path.slice(0,i);
              }
              if(path && path.at(-1)!='/'){
                    path   += '/';
              }
              
              var ext;
              var i1    = fn.lastIndexOf('.');
              if(i1!=-1){
                    ext   = fn.slice(i1);
                    fn    = fn.slice(0,i1);
              }
                                                                                //console.log(path);
                                                                                //console.log(fn);
                                                                                //console.log(ext);
              var err;
              
              try{
              
                    var url     = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=true`;
                    var res     = await fetch(url)
                    
              }//try
              
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              
              if(err){
                    var str   = err.toString();
                    return {error:str};
              }

              
              if(!res.ok){
                    var txt   = await res.text();
                    return {error:txt};
              }
              
              var json    = await res.json();
              
              var max     = 0;
              json.tree.forEach(async(item,i)=>{
                                                                                //console.log(i,item.path);
                    if(item.path.startsWith(`${path}backup/${fn}`)){
                          var i2    = item.path.lastIndexOf('-');
                          var i3    = item.path.lastIndexOf('.');
                          if(i3==-1 || i3<i2){
                                i3    = item.path.length;
                          }
                          var s     = item.path.slice(i2+1,i3);
                          var v     = Number(s);
                                                                                //console.log(i,i2,i3,`[${s}]`,v);
                          if(!isNaN(v)){
                                if(v>max){
                                      max   = v;
                                }
                          }
                    }
                    
              });
              max++;
              
              path    = `${path}backup/${fn}-${max}`;
              if(ext){
                    path   += ext;
              }
                                                                                debug(path);
              save(token,owner,repo,branch,path,txt);
              
              return {ok:true};
              
        }//backup
        
        
        backup.clear    = async function(token,owner,repo,branch,path,all){
        
              var fn;
              var i   = path.lastIndexOf('/');
              
              if(i==-1){
                    fn      = path;
                    path    = '';
              }else{
                    fn      = path.slice(i+1);
                    path    = path.slice(0,i);
              }

              
              var err;
              
              try{
              
                    var url     = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=true`;
                    var res     = await fetch(url)
                    
              }//try
              
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              
              if(err){
                    var str   = err.toString();
                    return {error:str};
              }

              
              if(!res.ok){
                    var txt   = await res.text();
                    return {error:txt};
              }
              
              var json    = await res.json();

              var max     = 0;
              json.forEach(item=>{
              
                    if(item.path.startsWith(`backup/${fn}`)){
                          var i   = item.path.lastIndexOf('-');
                          var s   = item.path.slice(i+1);
                          var v   = Number(s);
                          if(!isNaN(v)){
                                if(v>max){
                                      max   = v;
                                }
                          }
                    }
                    
              });

              var ct    = 0;
              var n     = json.length;
              for(var i=0;i<n;i++){
              
                    var item    = json[i];
                    
                    var f       = true;
                    if(item.path.startsWith(`backup/${fn}`)){
                          if(!all){
                                if(item.path==`backup/${fn}-${max}`){
                                      f   = false;
                                }
                          }
                    }
                    if(f){
                          var result    = await del(item.path,item.sha);
                          if(result.error){
                                                                                console.log('[ github ]','error');
                                                                                console.log(result.error);
                          }else{
                                ct++;
                          }
                    }
                    
              }//for
              
              var str   = `delete ${ct} files`;
              return {ok:str};
              
              
              async function del(path,sha){
              
                    var err;
                    
                    try{

                          var json      = {messsage:'delete file',sha};
                          var body      = JSON.stringify(json);                                
                          var url       = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
                          var headers   = {};
                          if(token){
                                headers.authorization   = `bearer ${token}`;
                          }
                          var res     = await fetch(url,{method:'delete',headers,body});
                          
                    }//try
                    
                    catch(err2){
                    
                          err   = err2;
                          
                    }//catch
                    
                    if(err){
                          var str   = err.toString();
                          return {error:str};
                    }


                    var txt   = await res.text();
                    
                    if(!res.ok){
                          return {error:txt};
                    }
                    
                    return {ok:txt};
              
              }//del
              
        }//clear


  //:
  
  
        download.dir    = function(owner,repo,branch,path,update,complete,token,api){
                                                                                debug('download',owner,repo,branch,path,token,api);              
              var resolve,promise=new Promise(res=>resolve=res);
              
              setTimeout(fn,50);
              
              
              async function fn(){
              
                    if(path.startsWith('/')){
                          path    = path.slice(1);
                    }
                    if(path.endsWith('/')){
                          path    = path.slice(0,-1);
                    }
                    
                    var zip     = new JSZip();
                    
                    var url       = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=true`;
                    var headers   = {};
                    if(token){
                          headers.authorization   = `bearer: ${token}`;
                    }
                    
                    var json    = await fetch(url,{headers}).then(res=>res.json()).catch(error);

                    var item    = json.tree.find(o=>o.path===path);
                    if(item){
                          if(item.type=='blob'){
                                var i   = path.lastIndexOf('/');
                                if(i==-1){
                                      path    = '';
                                }else{
                                      path    = path.slice(0,i);
                                }
                          }
                    }else{
                          if(path){
                                error('not found : '+path);
                                return;
                          }
                    }
                    
                    if(path){
                          if(path.slice(-1)!='/'){
                                path   += '/';
                          }
                    }
                                                                                debug('path',path);
                    var file    = `${path.split('/').filter(Boolean).at(-1)||repo}.zip`;
                                                                                debug('file',file);
                                                                                
                    var ct      = 0;
                    var total   = 1;
                    if(typeof update=='function'){
                          update(ct,total);
                    }

                     
                    var err;             
                    
                    try{
                    
                          await Promise.all(json.tree.map(async item=>{
                          
                                if(!item.path.startsWith(path))return;
                                
                                total++;
                                if(typeof update=='function'){
                                      update(ct,total);
                                }
                                
                                var fn    = item.path.slice(path.length);
                                if(item.type=='tree'){
                                      zip.folder(fn);
                                }else{
                                      var blob;
                                      if(token || api){
                                            blob    = await get.api(item);
                                      }else{
                                            blob    = await get.raw(item.path);
                                      }
                                      zip.file(fn,blob);
                                }
                                
                                ct++;
                                if(typeof update=='function'){
                                      update(ct,total);
                                }
                                
                          }));
                          
                    }//try
                    
                    catch(err2){
                    
                          err   = err2;
                          
                    }//catch
                    
                    if(err){
                          error(err);
                          return;
                    }

                    
                    ct++;
                    if(typeof update=='function'){
                          update(ct,total);
                    }
                    
                    var blob    = await zip.generateAsync({type:'blob'});
                    
                    if(complete==='download'){
                          var url         = window.URL.createObjectURL(blob);
                          var a           = document.createElement('a');
                          a.href          = url;
                          a.download      = file;
                          a.click();
                    }
                   
                    done({file,blob});
                    
              }//fn
              
              
              function error(err){
                                                                                debug('error',err);
                    done({error:err});
                    
              }//error
              
              
              function done(result){
              
                    if(typeof complete=='function'){
                          complete(result);
                    }
                    
                    resolve(result);
              
              }//done
              
              
              get.raw   = async function(path){
                                                                                console.log('raw',owner,repo,branch,path);
                    var url     = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
                    var blob    = await fetch(url).then(res=>res.blob());
                    return blob;
                    
              }//raw
              
              
              get.api   = async function(item){
                                                                                console.log('api',item.url,token);
                    var headers   = {};
                    if(token){
                          headers.authorization   = `bearer: ${token}`;
                    }
                    var res     = await fetch(item.url,{headers});
                    var json    = await res.json();
                    var b64     = json.content;
                    var blob    = b64_blob(b64);
                    return blob;
              
              }//api

              
              return promise;
        
        }//dir


  //:
  

      function datatype(v){
      
            var str   = Object.prototype.toString.call(v);
            str       = str.slice(8,-1);
            str       = str.toLowerCase();
            return str;
            
      }//datatype

        
      async function blob_b64(blob){
      
            var buf     = await blob.arrayBuffer();
            var bytes   = new Uint8Array(buf);
            var bin     = bytes.reduce((acc,byte)=>acc+=String.fromCharCode(byte),'');
            var b64     = btoa(bin);
            return b64;
      
      }//blob_b64


      function b64_blob(b64,type='text/plain'){
      
            var bin     = atob(b64);
            var bytes   = [...bin].map(c=>c.charCodeAt(0));
            var buf     = new Uint8Array(bytes);
            var blob    = new Blob([buf],{type});
            return blob;
            
      }//b64_blob
        

  //:  

  
        function debug(){
        
              if(!github.df){
                    return;
              }
              
              var str   = [...arguments].join(' ');
              console.log('[ github ]',str);
              
        }//debug
        

        
        return github;
        
})();



