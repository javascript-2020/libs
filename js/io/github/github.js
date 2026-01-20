


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
        parse.to              = {};
        
        
  //:
  
  
        github.df                   = false;
        
        
        github.token                = null;
        github.owner                = null;
        
        
        
        github.parse                = parse;
        github.build                = build;
        github.build.website        = build_website;
        
        
        github.file                 = {};
        github.file.load            = load;
        github.load                 = load;
        github.file.save            = save;
        github.save                 = save;
        github.file.backup          = backup;
        github.backup               = backup;
        github.file.download        = download;
        github.download             = download;
        
        
        github.dir                  = {};
        github.dir.download         = dirdownload;
        github.dir.list             = dirlist;
        github.dir.list.full        = dirlistfull;
        
        
        github.user                 = {};
        github.user.repolist        = repolist;
        github.user.repolist.all    = repolistall;
        
        
        github.repo                 = {};
        github.repo.default         = repodefault;
        github.repo.tree            = repotree;
        github.repo.zip             = repozip;
        
        
        
        
        
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
              var file      = path.split('/').at(-1);
              return {owner,repo,branch,path,file};
              
        }//github.io
        
                                                                                //  https://github.com/javascript-2020/libs
        parse.repo    = function(url){
                                                                                debug('repo');
              var parts     = url.pathname.split('/');
              var owner     = parts.shift();
              var repo      = parts.shift();
              var branch    = 'main';
              var path      = '';
              var file      = '';
              return {owner,repo,branch,path,file};
              
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
              var file      = parts.at(-1);
              return {owner,repo,branch,path,file};
              
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
              var path      = parts.join('/')+'/';
              var file      = '';
              return {owner,repo,branch,path,file};
              
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
  
  
        parse.to.api    = function(url){
        
              var {owner,repo,branch,path}    = parse(url);
              var url   = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
              return url;
              
        }//api
        
        
        parse.to.raw    = function(url){
        
              var {owner,repo,branch,path}    = parse(url);
              
              var url     = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
              
              return url;
              
        }//raw
        
        
        
  //:
  
  
        function build({api,token,owner,repo,branch,path}){
        
              if(arguments.length!=1){
                    [api,token,owner,repo,branch,path]    = arguments;
              }
              
              if(path.startsWith('/')){
                    path    = path.slice(1);
              }
              
              var url   = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
              
              if(api){
                    token   = token||github.token||localStorage.getItem('github-token');
                    url     = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
              }
              
              return url;
              
        }//build
        
        
        
        function build_website({owner,repo,branch,path,type}){
        
              type      = type||'blob';
              
              var url   = `https://github.com/${owner}/${repo}/${type}/${branch}`;
              if(path){
                    url  += `/${path}`;
              }
              
              return url;
              
        }//website
        
        
        function build_to_raw({}){
        }//raw
        
        function build_to_api({}){
        }//api
        
        
  //:
  
  
        function load({token,owner,repo,branch,path}){
        
              if(arguments.length!=1){
                    [token,owner,repo,branch,path]    = arguments;
              }
              
              token     = token||github.token;
              if(!token && typeof localStorage!='undefined'){
                    token   = localStorage['github-token'];
              }
              owner     = owner||github.owner;
              branch    = branch||'main';
              
              var result;
              if(token){
                    result    = load.api({token,owner,repo,branch,path});
              }else{
                    result    = load.raw({owner,repo,branch,path});
              }
              return result;
              
        }//load
        
        
        load.text   = async function({token,owner,repo,branch,path}){
        
              var {blob,error}    = await load.apply(null,arguments);
              if(error){
                    return {error};
              }
              
              var txt   = await blob.text();
              return {txt};
              
        }//text
        
        
        load.raw    = async function({owner,repo,branch,path}){
        
              if(arguments.length!=1){
                    [owner,repo,branch,path]    = arguments;
              }
              
              owner     = owner||github.owner;
              branch    = branch||'main';
              if(path.startsWith('/')){
                    path    = path.slice(1);
              }
              
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
              return {ok:blob,blob};
              
        }//raw
        
        
        load.api    = async function({token,owner,repo,branch,path}){
        
              if(arguments.length!=1){
                    [token,owner,repo,branch,path]    = arguments;
              }
              
              token     = token||github.token;
              if(!token && typeof localStorage!='undefined'){
                    token   = localStorage['github-token'];
              }
              owner     = owner||github.owner;
              branch    = branch||'main';
              
              if(path.startsWith('/')){
                    path    = path.slice(1);
              }
              
              var url       = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
              var headers   = {authorization:`Bearer ${token}`,accept:'application/vnd.github+json'};
                                                                                debug('load.api',url);
                                                                                
              var err;
              try{
              
                    var res   = await fetch(url,{headers});
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                                                                                debug('error',err);
                    return {error:err};
              }
              
              if(!res.ok){
                    var error   = await res.text();
                                                                                debug('http error',error);
                    return {error};
              }
                                                                                debug('ok');
              var json    = await res.json();
              
              if(datatype(json)=='array'){
                    var error   = 'notfound';
                    return {error};
              }
              
              var mime    = getmime(json.name);
              var blob    = await b64_blob(json.content,mime);
              
              return {ok:blob,blob};
              
        }//api
        
        
  //:
  
  
        async function save({token,owner,repo,branch,path,blob}){
        
              if(arguments.length!=1){
                    [token,owner,repo,branch,path,blob]   = arguments;
              }
              
              token     = token||github.token;
              if(!token && typeof localStorage!='undefined'){
                    token   = localStorage['github-token'];
              }
              owner     = owner||github.owner;
              branch    = branch||'main';
              
              if(path.startsWith('/')){
                    path    = path.slice(1);
              }
              
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
        
        
        async function backup({token,owner,repo,branch,path}){
        
              if(arguments.length!=1){
                    [token,owner,repo,branch,path]    = arguments;
              }
                                                                                debug('backup',path);
              token     = token||github.token;
              if(!token && typeof localStorage!='undefined'){
                    token   = localStorage['github-token'];
              }
              owner     = owner||github.owner;
              branch    = branch||'main';
              
              if(path.startsWith('/')){
                    path    = path.slice(1);
              }
              
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
        
        
        backup.clear    = async function({token,owner,repo,branch,path,all}){
        
              if(arguments.length!=1){
                    [token,owner,repo,branch,path,all]    = arguments;
              }
              
              token     = token||github.token;
              if(!token && typeof localStorage!='undefined'){
                    token   = localStorage['github-token'];
              }
              owner     = owner||github.owner;
              branch    = branch||'main';
              
              if(path.startsWith('/')){
                    path    = path.slice(1);
              }
              
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
  
  
        function dirdownload({owner,repo,branch,path,update,complete,token,api}){
        
              if(arguments.length!=1){
                    [owner,repo,branch,path,update,complete,token,api]    = arguments;
              }
              
              token     = token||github.token;
              if(!token && typeof localStorage!='undefined'){
                    token   = localStorage['github-token'];
              }
              owner     = owner||github.owner;
              branch    = branch||'main';
              
              if(path.startsWith('/')){
                    path    = path.slice(1);
              }
                                                                                debug('download.dir',owner,repo,branch,path,token,api);
              var resolve,promise=new Promise(res=>resolve=res);
              
              setTimeout(fn,50);
              
              
              async function fn(){
              
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
        
        
        async function dirlist({token,owner,repo,branch,path}){
        
        
        }//dirlist
        
        
        async function dirlistfull({token,owner,repo,branch,path,files_only}){
        
              if(arguments.length!=1){
                    [token,owner,repo,branch,path,files_only]   = arguments;
              }
              
              token     = token||github.token;
              if(!token && typeof localStorage!='undefined'){
                    token   = localStorage['github-token'];
              }
              owner             = owner||github.owner;
              branch          ||= 'main';
              path            ||= '';
              
              if(path.startsWith('/')){
                    path    = path.slice(1);
              }
              if(path.endsWith('/')){
                    path    = path.slice(0,-1);
              }
              
              var url       = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=true`;
              var headers   = {};
              if(token){
                    headers.authorization   = `bearer: ${token}`;
              }
              
              var err;
              try{
              
                    var res   = await fetch(url,{headers});
                    
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
              
              var json    = await res.json();
              
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
                          error   = 'not found : '+path;
                          return {error};
                    }
              }
              
              if(path){
                    if(path.slice(-1)!='/'){
                          path   += '/';
                    }
              }
              
              var len     = path.length;
                                                                          debug('path',path);
              var list    = [];
              var list    = json.tree.filter(item=>{
              
                                  if(!item.path.startsWith(path))return;
                                  if(files_only){
                                        if(item.type!='blob')return;
                                  }
                                  return true;
                                  
                            });
              list        = list.map(item=>{
                                                                          //console.log(item);
                                  var i           = item.path.lastIndexOf('/');
                                  var name        = item.path.slice(i+1);
                                  var i           = -name.length;
                                  var path2       = item.path.slice(len,i);
                                  var abs         = '/'+item.path;
                                  var type        = item.type=='blob' ? 'file' : 'dir';
                                  var size        = item.size;
                                  
                                  
                                  var file        = {};
                                  
                                  file.ft         = 'github';
                                  file.type       = type;
                                  file.abs        = abs;
                                  file.path       = path2;
                                  file.rel        = path2;
                                  file.name       = name;
                                  file.size       = size;
                                  
                                  return file;
                                  
                            });
                            
              return {list};
              
        }//dirlistfull
        
        
        
  //:
  
  
        async function repolist({owner,token}={}){
        
              owner             = get.owner(owner);
              token             = get.token(token);
              
              var headers       = get.headers({token});
              
              var url           = `https://api.github.com/users/${owner}/repos`;
              
              var {res,error}   = await gfetch(url,{headers});
              if(error){
                    return {error};
              }
              
              var json          = await res.json();
                                                                                console.log(json);
              var list          = json.map(item=>item.name);
              return {list};
              
        }//repolist
        
        
  //:
  
  
        async function repodefault({owner,repo,token}){
        
              owner               = get.owner(owner);
              token               = get.token(token);
              var headers         = get.headers({token});
              var url             = `https://api.github.com/repos/${owner}/${repo}`;
              
              var {res,error}     = await gfetch(url,{headers});
              if(error){
                    return {error};
              }
              
              var json            = await res.json();
              var branch          = json.default_branch;
              return {branch};
              
        }//repodefault
        
        
        async function repotree({owner,repo,branch,token}){
        
              owner             = get.owner(owner);
              token             = get.token(token);
              var headers       = get.headers({token});
              
              var url           = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=true`;
              
              var {res,error}   = await gfetch(url,{headers});
              if(error){
                    return {error};
              }
              
              var json          = await res.json();
              var tree          = json.tree;
              return {tree};
              
        }//repotree
        
        
        
        
        async function repolistall({token}={}){
        
              token             = get.token(token);
              var headers       = get.headers({token});
              
              var url           = 'https://api.github.com/user/repos';
              
              var {res,error}   = await gfetch(url,{headers});
              if(error){
                    return {error};
              }
              
              var json    = await res.json();
              return json;
              
        }//repolistall
        
        
        async function repozip({owner,repo,branch,token}){
        
              token             = get.token(token);
              owner             = get.owner(owner);
              var headers       = get.headers({token});
                                                                                console.log(repo,token);
              var url           = `https://github.com/${owner}/${repo}/archive/refs/heads/${branch}.zip`;
              if(token){
                    url         = `https://api.github.com/repos/${owner}/${repo}/zipball/${branch}`;
              }
              
              var {res,error}   = await gfetch(url,{headers});
              if(error){
                    return {error};
              }
              var blob    = await res.blob();
              return {blob};
              
        }//repozip
        
        
        
  //:
  
  
        get.owner   = function(owner){
        
              owner   ||= github.owner;
              return owner;
              
        }//owner
        
        
        get.headers   = function({token,accept}){
        
              var headers   = {};
              if(token){
                    headers.authorization   = `bearer ${token}`;
              }
              if(accept){
                    headers.accept    = accept;
              }
              return headers;
              
        }//headers
        
        
        get.token   = function(token){
        
              if(token===false){
                    return token;
              }
              
              token     = token||github.token;
              
              if(!token && typeof localStorage!='undefined'){
                    token   = localStorage['github-token'];
              }
              return token;
              
        }//token
        
        
        async function gfetch(url,{headers}){
        
              var err;
              try{
              
                    var res   = await fetch(url,{headers});
                    
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
              
              return {res};
              
        }//gfetch
        
        
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
        
        
        function getmime(filename){
        
              var list    = {
              
                    // Text
                    
                    'txt': 'text/plain',
                    'html': 'text/html',
                    'htm': 'text/html',
                    'css': 'text/css',
                    'js': 'application/javascript',
                    'json': 'application/json',
                    'csv': 'text/csv',
                    'xml': 'application/xml',
                    
                    
                    // Images
                    
                    'jpg': 'image/jpeg',
                    'jpeg': 'image/jpeg',
                    'png': 'image/png',
                    'gif': 'image/gif',
                    'webp': 'image/webp',
                    'svg': 'image/svg+xml',
                    'ico': 'image/x-icon',
                    'bmp': 'image/bmp',
                    'tiff': 'image/tiff',
                    
                    
                    // Audio
                    
                    'mp3': 'audio/mpeg',
                    'wav': 'audio/wav',
                    'ogg': 'audio/ogg',
                    'm4a': 'audio/mp4',
                    
                    
                    // Video
                    
                    'mp4': 'video/mp4',
                    'webm': 'video/webm',
                    'mov': 'video/quicktime',
                    'avi': 'video/x-msvideo',
                    'mkv': 'video/x-matroska',
                    
                    
                    // Fonts
                    
                    'woff': 'font/woff',
                    'woff2': 'font/woff2',
                    'ttf': 'font/ttf',
                    'otf': 'font/otf',
                    
                    
                    // Docs
                    
                    'pdf'       : 'application/pdf',
                    'doc'       : 'application/msword',
                    'docx'      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'xls'       : 'application/vnd.ms-excel',
                    'xlsx'      : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'ppt'       : 'application/vnd.ms-powerpoint',
                    'pptx'      : 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    
                    
                    // Archives
                    
                    'zip'       : 'application/zip',
                    'tar'       : 'application/x-tar',
                    'gz'        : 'application/gzip',
                    'rar'       : 'application/vnd.rar',
                    '7z'        : 'application/x-7z-compressed'
                    
              };
              
              var i       = filename.lastIndexOf('.');
              var ext     = filename.slice(i+1);
              
              var def     = 'application/octet-stream';
              var mime    = list[ext]||def
              
              return mime;
              
        }//getmime
        
        
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


