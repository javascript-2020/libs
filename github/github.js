


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
        
  //:

        
        setTimeout(init,50);
        
        function init(){
        
              github.df             = true;
              
              github.parse          = parse;  
              github.load           = load;
              github.save           = save;
              github.backup         = backup;
              github.download       = download.dir;

              
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
              return result;
              
        }//parse

                                                                                //  https://javascript-2020.github.io/html-components/log/log.html
        parse['github.io']=function(url){
                                                                                debug('github.io');
              var i         = url.hostname.indexOf('.');
              var owner     = url.hostname.slice(0,i);
              var repo      = url.hostname;
              var branch    = 'main';
              var path      = url.pathname.slice(1);
              return {owner,repo,branch,path};
              
        }//github.io
        
                                                                                //  https://github.com/javascript-2020/libs
        parse.repo=function(url){
                                                                                debug('repo');
              var parts     = url.pathname.split('/');
              var owner     = parts.shift();
              var repo      = parts.shift();
              var branch    = 'main';
              var path      = '';
              return {owner,repo,branch,path};
              
        }//repo

                                                                                //  https://github.com/javascript-2020/libs/blob/main/docker/nodejs-min.dockerfile
        parse.file=function(url){
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
        parse.dir=function(url){
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

              
              var txt   = await res.text();
              
              if(!res.ok){
                    return {error:txt};
              }
              
              return {ok:txt};
              
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

              
              var json    = await res.json();
              var txt     = window.atob(json.content);
              
              if(!res.ok){
                    return {error:txt};
              }
              
              return {ok:txt};
              
        }//api


  //:
  
  
        async function save(token,owner,repo,branch,path,txt){
        
              var headers     = {authorization:`Bearer ${token}`};
              var url         = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

              
              var err;
              
              try{
              
                    var json        = await fetch(url,headers).then(res=>res.json());
                    
              }//try
              
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              
              if(err){
                    return {error:err};
              }

              
              var sha         = json.sha;
              
              var content     = window.btoa(txt);
              var message     = 'save text';
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
              return {ok:txt};
              
        }//save
        

        async function backup(token,owner,repo,branch,path){
                                                                                debug('backup',path);
              var api   = true;
              var txt   = load.text(api,token,owner,repo,branch,path);
              
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
              json.tree.forEach(async item=>{
              
                    if(item.path.startsWith(`${path}backup/${fn}`)){
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
              max++;
              
              path    = `${path}backup/${fn}-${max}`;
                                                                                debug(path);
              save(token,owner,repo,branch,path,txt);
              
              return {ok:true};
              
        }//backup
        
        
        backup.clear=async function(token,owner,repo,branch,path,all){
        
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
  
  
        download.dir    = function(owner,repo,branch,path,update,complete){
                                                                                debug('download',owner,repo,branch,path);              
              var resolve,promise=new Promise(res=>resolve=res);
              
              setTimeout(fn,50);
              
              return promise;
              
              
              async function fn(){
              
                    var zip     = new JSZip();
                    
                    var url     = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=true`;
                    var json    = await fetch(url).then(res=>res.json()).catch(error);

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
                                      var res     = await fetch(item.url);
                                      var blob    = await res.blob();
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
        
        }//dir


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



