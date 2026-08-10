


/*

openssl.mjs

27-05-26

*/
                                                                                //debugger;
                                                                                var df=false;
                                                                                df && console.log('[ openssl.mjs ]');
        var platform    = typeof document=='undefined' ? 'node' : 'browser';
                                                                                df && console.log('[ openssl.mjs ]','       platform  :',platform);
        var opensslmod;
        
        switch(platform){
        
          case 'browser'    : await browser();        break;
          case 'node'       : await node();           break;
          
        }//switch
        
        export {opensslmod}
        
        
  //:
  
  
        async function browser(){
                                                                                df && console.log('[ openssl.mjs ]','import.meta.url  :',import.meta.url);
              var url                   = new URL('./openssl.js',import.meta.url).href;
                                                                                df && console.log('[ openssl.mjs ]','            url  : ',url);
              var txt                   = await fetch(url).then(res=>res.text());
              var js                    = `
                                                (()=>{
                                                
                                                      var opensslmod    = ${txt};
                                                      return opensslmod;
                                                      
                                                })();
                                          `;
              opensslmod                = eval(js);
              
              var wasmJs                = new URL('openssl.wasm.js',url).href;
                                                                                df && console.log('[ openssl.mjs ]','wasmJs',wasmJs);
              opensslmod.wasmJs         = wasmJs;
              
        }//browser
        
        
        async function node(){
                                                                                df && console.log('[ openssl.mjs ]','import.meta.url  :',import.meta.url);
              var fs                    = await import('node:fs');
              var path                  = await import('node:path');
              var {createRequire}       = await import('node:module');
              var require               = createRequire(import.meta.url);
              var url                   = await import('node:url');
              
              opensslmod                = require('./openssl.js');
              //opensslmod                = globalThis.opensslmod;
              
              opensslmod.fs             = fs;
              opensslmod.path           = path;
              opensslmod.__filename     = url.fileURLToPath(import.meta.url);
              opensslmod.__dirname      = path.dirname(opensslmod.__filename)+'/';
              
        }//node
        
        
        
        
        
        