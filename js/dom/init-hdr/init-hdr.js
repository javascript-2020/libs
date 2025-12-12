


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
        var debug;

        var ace;
        
        var menu;
            
        
        
    //:

              
        async function init_hdr(){
                                                                                debug('init_hdr',version);
              
              menu      = menumod();

              mod.base.add({ext,$,datatype,keydown,menu,menumod,ace});

              
              if(typeof init!='function'){
                                                                                console.log('no init');
                    await mod.auto();
                    
                    if(typeof start=='function'){
                          start();
                    }
              }

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
              'js/debug/debug.js',
        );
        [$,datatype,menumod,keydown,debug]   = await promise;
  
        
        mod.stack.complete;
              
})();

                  






