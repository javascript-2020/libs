

        var js    = await fetch('https://libs.ext-code.com/js/io/file-server/file-server.js').then(res=>res.text());
        var file_server   = eval(`
              (()=>{
                    var mod   = ${js}
                    return mod;
              })();
        `);
        export { file_server as 'file-server' };
        
        
        
        
        
        