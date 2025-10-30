


                                                                                console.clear();
                                                                                console.log('libs update');
                                                                                console.log();

        var url           = 'https://github.com/javascript-2020/libs/blob/main/html/file-nav/html/new-file/v2.0/new-file-v2.0.html';
        var url           = await navigator.clipboard.readText();
        var parts         = url.split('/');
        var path          = parts.slice(7,-3).join('/')+'/';
        console.log(path);
        var mod           = parts.at(-3);
        console.log(mod);



        return;






        var {ext}         = await import('https://libs.ext-code.com/js/io/ext-loader/ext-loader.m.js');
        var [github]      = await ext.load.libs('js/io/github/github.js');
        github.owner      = 'javascript-2020';
        var repo          = 'libs';
        
        
        var path          = 'html/file-nav/html/';
        var mod           = 'new-file';
                                                                                console.log(mod);
        
        var {blob}        = await github.file.load({repo,path:`${path}${mod}/v2.0/${mod}-v2.0.html`});

        var {ok,error}    = await github.file.save({repo,path:`${path}${mod}/${mod}.html`,blob});
        if(error){
              console.error(error);
              return;
        }
        
        console.log('ok');
        console.log(ok);
        
        
        
        
        