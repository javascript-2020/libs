


        var txt   = await fetch('https://libs.ext-code.com/js/crypto/openssl/openssl-v2.0.0.js').then(res=>res.text());
        var js    = `
                    (()=>{
                    
                          var opensslmod    = ${txt};
                          return opensslmod;
                          
                    })();
                    `;
        var opensslmod    = eval(js);
        
        export {opensslmod};
        
        
        
        