

                                                                                //console.log('import.meta.url',import.meta.url);
        var url   = new URL('./openssl.js',import.meta.url).href;
                                                                                //console.log('url',url);
        var txt   = await fetch(url).then(res=>res.text());
        var js    = `
                    (()=>{
                    
                          var opensslmod = ${txt};
                          return opensslmod;
                          
                    })();
                    `;
        var opensslmod    = eval(js);
        
        export {opensslmod};
        
        
        
        