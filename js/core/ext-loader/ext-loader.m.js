

        await fetch('https://libs.ext-code.com/js/core/ext-loader/ext-loader.js').then(res=>res.text().then(eval));

        export {ext:window.ext};
        
        
        