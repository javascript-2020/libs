

        var js    = await fetch('https://libs.ext-code.com/js/io/tiny-unzip/tiny-unzip.js').then(res=>res.text());
        var zip   = eval(`${js}(zip)`);
        export {zip};
        
        
        
