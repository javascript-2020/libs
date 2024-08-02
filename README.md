# libs

various libraries for different languages




```

        fetch.import          = url=>fetch(url).then(res=>res.text().then(js=>Promise.resolve(eval(`(${js})`))));
        fetch.import.gitraw   = url=>fetch.import('https://raw.githubusercontent.com/'+url);
        fetch.import.me       = url=>{var i=url.indexOf('/'),repo=url.slice(0,i),path=url.slice(i+1);
                                      return fetch.import.gitraw(`javascript-2020/${repo}/main/${path}`)};

```



download a github repo

```

        var url     = 'https://github.com/jbis9051/JamesSOBot/archive/refs/heads/i-learned-how-to-code.zip';
        
        function install(){
        
              await exec('npm install');
              await exec('npm run build');
        
        }//install


        (async()=>{
                                                                                console.clear();
              var fs      = require('node:fs');
              var cp      = require('node:child_process');
                                                                                console.log('\n','downloading',url,'\n');
              var buf     = await fetch(url).then(res=>res.arrayBuffer());
              
              var url     = 'https://raw.githubusercontent.com/stuk/jszip/main/dist/jszip.min.js';
              var JSZip   = (await fetch(url).then(res=>res.text()
                                .then(txt=>Promise.resolve(eval(txt))))) && module.exports;
                                
              var zip     = new JSZip();
              zip         = await zip.loadAsync(buf,{createFolders:true});
              
              var dir;
              for(var name in zip.files){
                                                                                console.log(name);
                    !dir && (dir=name);
                    var file    = zip.files[name];
                    if(file.dir){
                          if(!fs.existsSync(name)){
                                fs.mkdirSync(name);
                          }
                    }else{
                          var buf   = await zip.file(name).async('uint8array');
                          fs.writeFileSync(name,buf);
                    }
              } //for
              
              console.log('\n',dir);
              process.chdir(dir);
              
                                                                                console.log('\n','install','\n');
              install();
              
              function exec(cmd) {
                                                                                console.log('\n',cmd,'\n');
                    var args    = cmd.split(' ');
                    cmd         = args.shift();
                    
                    var resolve,promise=new Promise(res=>resolve=res);
                    
                    var child   = cp.spawn(cmd,args);
                    child.stdout.pipe(process.stdout);
                    child.stderr.pipe(process.stderr);
                    child.on('exit',code=>{
                                                                                
                          code!=0 && process.exit();
                          resolve();
                          
                    });
                    
                    return promise;
                    
              } //exec
              
        })();
        
```
