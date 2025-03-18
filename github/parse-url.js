




        github.parse    = {};
      
      
        //  https://javascript-2020.github.io/html-components/log/log.html
        parse['github.io']=function(url){
                                                                  debug('github.io');
              var i         = url.hostname.indexOf('.');
              var owner     = url.hostname.slice(0,i);
              var repo      = url.hostname;
              var branch    = 'main';
              var path      = url.pathname.slice(1);
              write(owner,repo,branch,path);
              
        }//github.io
        
        //  https://github.com/javascript-2020/libs
        parse.repo=function(url){
                                                                  debug('repo');
              var parts     = url.pathname.split('/');
              var owner     = parts.shift();
              var repo      = parts.shift();
              var branch    = 'main';
              var path      = '';
              write(owner,repo,branch,path);
              
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
              write(owner,repo,branch,path);
        
        }//file
        
        //  https://github.com/javascript-2020/libs/tree/main/docker
        parse.dir=function(url){
                                                                  debug('dir');
              var parts     = url.pathname.split('/');
              var owner     = parts.shift();
              var repo      = parts.shift();
              parts.shift();
              var branch    = parts.shift();
              var path      = parts.join('/');
              write(owner,repo,branch,path);
              
        }//dir




