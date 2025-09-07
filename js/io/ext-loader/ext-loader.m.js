

        var js    = await fetch('https://libs.ext-code.com/js/core/ext-loader/ext-loader.js').then(res=>res.text());
        var ext   = eval(`
              (()=>{
                    ${js}
                    return ext;
              })();
        `);
        export {ext};
        
        
        
