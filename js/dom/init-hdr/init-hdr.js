


                                                                                console.clear();
                                                                                console.log('[ init-hdr ]');
                                                                                console.log();
                                                                                console.json=v=>console.log(JSON.stringify(v,null,4));
        var df=false,did='init-hdr',version='v1.0'
        ;


        var ext;
        var $;
        var datatype;
        var menumod;
        var keydown;
        var code;
        var debug;

        var ace;
        
        var menu;
            
        
        
    //:

              
        async function init(){
                                                                                debug('init',version);
              
              menu      = menumod();

              await mod.auto({ext,$,datatype,keydown,menu,menumod,ace});
              
              start();
              
        }//init


  //:
  
  
(async()=>{

        mod.stack.add;
        
        ({ext}    = await import('https://libs.ext-code.com/js/io/ext-loader/ext-loader.m.js'));
          
        var promise   = ext.load.libs(
              'js/dom/$.js.api',
              'js/core/datatype.js',
              'js/dom/menumod/menumod.js',
              'js/dom/keydown/keydown.js',
              'js/dom/code/v2.0/code-v2.0.js.api',
              'js/debug/debug.js',
        );
        [$,datatype,menumod,keydown,code,debug]   = await promise;
  
        code.initmod({ext,$,datatype,menumod});
        
        [srcdoc]    = await ext.text.github('javascript-2020:javascript-2020.github.io:main:blog/25-07-25/http-streaming-download/ex/srcdoc.html');
        
        mod.stack.complete;
              
})();

                  






