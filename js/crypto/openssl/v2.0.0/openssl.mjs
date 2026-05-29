


/*

openssl.m.js

27-05-26

*/
        var df=false;

        var platform    = typeof document=='undefined' ? 'node' : 'browser';
                                                                                df && console.log('       platform  :',platform);
        var opensslmod;
        
        switch(platform){
          
          case 'browser'    : await browser();        break;
          case 'node'       : await node();           break;
            
        }//switch
        
        export {opensslmod}

        
  //:

  
        async function browser(){
                                                                                df && console.log('import.meta.url  :',import.meta.url);
              var url       = new URL('./openssl.js',import.meta.url).href;
                                                                                df && console.log('            url  : ',url);
              var txt       = await fetch(url).then(res=>res.text());
              var js        = `
                                    (()=>{
                                    
                                          var opensslmod    = ${txt};
                                          return opensslmod;
                                          
                                    })();
                              `;
              opensslmod    = eval(js);
          
        }//browser
        
        
        async function node(){
          
              var fs                = await import('node:fs');
              var path              = await import('node:path');
              var {createRequire}   = await import('node:module');
              var require           = createRequire(import.meta.url);
              var url               = await import('node:url');
              
              opensslmod        = require('./openssl.js');
              
              //opensslmod                = globalThis.opensslmod;
              opensslmod.fs             = fs;
              opensslmod.path           = path;
              opensslmod.__filename     = url.fileURLToPath(import.meta.url);
              opensslmod.__dirname      = path.dirname(opensslmod.__filename)+'/';

        }//node
        




        