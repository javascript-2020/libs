


        var output    = window.parent.output;
        output.set();
                                                                                console.clear();
                                                                                console.log('---  html latest updater  ---').style.cssText='border:2px solid blue;padding:5px 10px';
                                                                                console.log();


        
        var {ext}                           = await import('https://libs.ext-code.com/js/io/ext-loader/ext-loader.m.js');
        [github,datatype,$]                 = await ext.load.libs('js/io/github/github.js','js/core/datatype.js','js/dom/$.js.api');
        github.owner                        = 'javascript-2020';

                
        var btn   = (value,onclick)=>$.create.input({value,type:'button',onclick,style:'padding:5px 10px;font-size:16px;cursor:pointer;margin:10px;display:block'});
        output.node(btn('run',run));

                
        var div   = output.node('div');
        output.set(div);

        
        run();
        
        async function run(){
          
              output.iframe.contentWindow.focus();
                                                                                console.clear();
              
          
              var path                            = 'html/file-nav/html/';
              var mod                             = 'new-file';
              var url                             = '';
      
      
              if(1){
                
                    var url                       = 'https://github.com/javascript-2020/libs/blob/main/html/file-nav/html/new-file/v2.0/new-file-v2.0.html';
                    var url                       = 'https://github.com/javascript-2020/libs/blob/main/html/file-nav/html/new-file/new-file.html';
                    var url                       = 'https://github.com/javascript-2020/libs/tree/main/html/file-mod'
                    
                    if(1){
                                                                                console.log('[ clipboard ]');
                          var url                 = await navigator.clipboard.readText();
                    }
                                                                                console.log('url :',url);
                    var result                    = github.parse(url);
                                                                                console.log('parse :',result);
                    if(result.error){
                                                                                console.error(result.error);
                          return;
                    }

                    var repo                      = result.repo;
                                                                            
                    var parts                     = result.path.split('/');
                    var path;
                    var mod;
                    if(!result.file){
                                                                                console.log('[ dir ]');
                          path                    = parts.slice(0,-2).join('/')+'/';
                          mod                     = parts.at(-2);
                    }else{
                          if(isver(parts.at(-2))){
                                                                                console.log('[ version ',parts.at(-2),']');
                                path              = parts.slice(0,-3).join('/')+'/';
                                mod               = parts.at(-3);
                          }else{
                                                                                console.log('[ latest ]');
                                path              = parts.slice(0,-2).join('/')+'/';
                                mod               = parts.at(-2);
                          }
                    }
              }
                                                                                console.log();
                                                                                console.log('path :',path);
                                                                                console.log(' mod :',mod);

              var src                             = `${path}${mod}/v2.0/${mod}-v2.0.html`;
              var dest                            = `${path}${mod}/${mod}.html`;
                                                                                console.log();
                                                                                console.log('   repo :',repo);
                                                                                console.log('    src :',src);
                                                                                console.log('   dest : ',dest);
        
              output.node(btn('update',update));

        
              async function update(){
                                                                                var d=console.log('update ... ');
                    var {blob}                    = await github.file.load({repo,path:src});
                    var {ok,error}                = await github.file.save({repo,path:dest,blob});
                    
                    if(error){
                                                                                console.error(error);
                          return;
                    }
              
                                                                                console.write('ok').style.color='green';
                                                                                //console.log(ok);
              }//update
              
        }//run
        
  //:

              function isver(str){
                
                    if(str[0]=='v'){
                          var c   = str[1];
                          if(c>='0' && c<='9'){
                                return true;
                          }
                    }
                    return false;
                    
              }//isver
        
        
        