

        var js    = await fetch('https://libs.ext-code.com/js/io/tiny-unzip/v1.0/tiny-unzip-v1.0.js').then(res=>res.text());
        var zip   = eval(`(${js})`);
        export {zip};
        
        
        
