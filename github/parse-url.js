        var parse   = {};
      
        parse.github    = function(url){
        
              url   = window.decodeURIComponent(url);
              if(!url.startsWith('http')){
                    url   = 'https://'+url;
              }
              url   = new URL(url);
              var result;
              if(url.hostname=='javascript-2020.github.io'){
                    result    = parse.github.io(url);
              }
              if(url.hostname=='github.com'){
                    if(url.pathname.indexOf('blob')!=-1){
                          result    = parse.github.file(url);
                    }else 
                    if(url.pathname.indexOf('tree')!=-1){
                          result    = parse.github.dir(url);
                    }else{
                          result    = parse.github.repo(url);
                    }
              }
              var {owner,repo,branch,path}    = result;
              
              var api   = true;
              var url   = parse.github.build(api,null,owner,repo,branch,path);
              
              return url;
              
        }//parse

      
        parse.github.build    = function(api,token,owner,repo,branch,path){

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
        
        
        parse.github.is   = {};
        
        parse.github.is.api   = function(url){
          
          
              if(url.includes('api.github.com')){
                    return true;
              }
              return false;
              
        }//api
        
        parse.github.is.raw   = function(url){
          
              if(url.includes('raw.githubusercontent.com')){
                    return true;
              }
              return false;
              
        }//raw
        
        
        //  https://javascript-2020.github.io/html-components/log/log.html
        parse.github.io=function(url){
                                                                  debug('github.io');
              var i         = url.hostname.indexOf('.');
              var owner     = url.hostname.slice(0,i);
              var repo      = url.hostname;
              var branch    = 'main';
              var path      = url.pathname.slice(1);
              return {owner,repo,branch,path};
              
        }//github.io

        
        //  https://github.com/javascript-2020/libs
        parse.github.repo=function(url){
                                                                  debug('repo');
              var parts     = url.pathname.split('/');
              var owner     = parts.shift();
              var repo      = parts.shift();
              var branch    = 'main';
              var path      = '';
              return {owner,repo,branch,path};
              
        }//repo

        
        //  https://github.com/javascript-2020/libs/blob/main/docker/nodejs-min.dockerfile
        parse.github.file=function(url){
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
        parse.github.dir=function(url){
                                                                  debug('dir');
              var parts     = url.pathname.split('/');
              var owner     = parts.shift();
              var repo      = parts.shift();
              parts.shift();
              var branch    = parts.shift();
              var path      = parts.join('/');
              return {owner,repo,branch,path};
              
        }//dir

                  
