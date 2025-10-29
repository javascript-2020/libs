


                                                                                console.clear();
                                                                                console.log('libs update');
                                                                                console.log();

        var {ext}         = await import('https://libs.ext-code.com/js/io/ext-loader/ext-loader.m.js');
        var [github]      = await ext.load.libs('js/io/github/github.js');
        github.owner      = 'javascript-2020';
        var repo          = 'libs';
        var path          = 'html/';
        
        var mod           = 'file-mod';
                                                                                console.log(mod);
        var {blob}        = await github.file.load({repo,path:`${path}${mod}/v2.0/${mod}-v2.0.html`});

        var {ok,error}    = await github.file.save({repo,path:`${path}${mod}/${mod}.html`,blob});
        if(error){
              console.error(error);
              return;
        }
        
        console.log('ok');
        console.log(ok);
        
        
        
        
        