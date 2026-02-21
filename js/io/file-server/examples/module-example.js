

        var dtype                   = v=>Object.prototype.toString.call(v).slice(8,-1).toLowerCase();
        
        
        var {'file-server':fs}      = await import('https://libs.ext-code.com/js/io/file-server/file-server.m.js');
        
        var type                    = dtype(fs);
                                                                                console.log(type,':',fs.version);
                                                                                
        fs.url                      = 'https://localhost:3000';
        fs.auth                     = 'p4ssw0rd';
        
        var {blob,error}            = await fs.file.load('/tmp/my-file.txt');
        if(error){
                                                                                console.log(error);
              return;
        }
        
        var txt   = await blob.text();
                                                                                console.log(txt);
                                                                                
                                                                                
                                                                                
                                                                                