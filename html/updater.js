


                                                                                console.clear();
                                                                                console.log('libs update');
                                                                                console.log();

        var {ext}               = await import('https://libs.ext-code.com/js/io/ext-loader/ext-loader.m.js');
        var [github]            = await ext.load.libs('js/io/github/github.js');
        github.owner            = 'javascript-2020';
        var repo                = 'libs';



        var path                = 'html/file-nav/html/';
        var mod                 = 'new-file';


        if(1){
              var url           = 'https://github.com/javascript-2020/libs/blob/main/html/file-nav/html/new-file/v2.0/new-file-v2.0.html';
              var url           = 'https://github.com/javascript-2020/libs/blob/main/html/file-nav/html/new-file/new-file.html';
              
              var url           = await navigator.clipboard.readText();
              
              var parts         = url.split('/');
              var path;
              var mod;
              if(parts.at(-2).startsWith('v')){
                    path        = parts.slice(7,-3).join('/')+'/';
                    mod         = parts.at(-3);
              }else{
                    path        = parts.slice(7,-2).join('/')+'/';
                    mod         = parts.at(-2);
              }
        }
                                                                                console.log(path);
                                                                                console.log(mod);

        var src                 = `${path}${mod}/v2.0/${mod}-v2.0.html`;
        var dest                = `${path}${mod}/${mod}.html`;
                                                                                console.log(src);
                                                                                console.log(dest);

        var msg   = `
        path    : ${path}
        mod     : ${mod}
        
        src     : ${src}
        dest    : ${dest}
        `;
        if(!confirm(msg)){
                                                                                console.log('aborted');
              return;
        }
                                                                            
        return;
        
        var {blob}              = await github.file.load({repo,path:src});
        var {ok,error}          = await github.file.save({repo,path:dest,blob});
        
        if(error){
              console.error(error);
              return;
        }
        
        console.log('ok');
        console.log(ok);
        
        
        
        
        