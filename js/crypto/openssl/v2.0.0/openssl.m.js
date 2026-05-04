

        console.log('import.meta.url',import.meta.url);
        
        var url   = new URL('./openssl.js', import.meta.url).href;
        console.log('url',url);
        
        //var txt   = await fetch('https://libs.ext-code.com/js/crypto/openssl/v2.0.0/openssl.js').then(res=>res.text());
        var txt   = await fetch(url).then(res=>res.text());
        var js = `
        (()=>{
        
              var opensslmod = ${js};
              return opensslmod;
              
        })();
        `;
        var opensslmod    = eval(txt);
        
        export {opensslmod};
        
        
        
        