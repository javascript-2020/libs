# libs

various libraries for different languages

```
                                                                                console.clear();
                                                                                console.json=v=>console.log(JSON.strinigify(v,null,4));
```


```
                  init.stack            = [];
                  init.stack.ct         = 0;
                  init.stack.total      = 1;
                  init.stack.mode       = 'log';
                  init.stack.complete   = false;
                  Object.defineProperty(init.stack,'add',{get:()=>{
                        init.stack.total++;
                        init.stack.mode && console[init.stack.mode]('add',init.stack.ct,init.stack.total);
                  }});
                  Object.defineProperty(init.stack,'complete',{get:()=>{
                        init.stack.ct++;
                        init.stack.mode && console[init.stack.mode]('complete',init.stack.ct,init.stack.total);
                        init.stack.ct>=init.stack.total && init();
                  }});
                  

                  //  (typeof init!='undefined' && init?.stack && init.stack.add)
                  //  (typeof init!='undefined' && init?.stack && init.stack.complete)


                  init.stack.add;
                  init.stack.complete;


```


```

        var sandbox     = {};
        sandbox.cjs     = txt=>Promise.resolve(eval(`(()=>{var exports={},module={},global={};${txt};return module.exports})()`));
        var url         = 'https://raw.githubusercontent.com/javascript-2020/npm/main/node-forge/node-forge-nodejs-eval.js';
        var nodeForge   = await fetch(url).then(res=>res.text().then(sandbox.cjs));

```



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
              
              var zip_url = 'https://raw.githubusercontent.com/stuk/jszip/main/dist/jszip.min.js';
              var JSZip   = (await fetch(zip_url).then(res=>res.text()
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



various types of loaders


```

        async function load(){

              //var nodeForge   = await import('https://cdn.jsdelivr.net/npm/node-forge/+esm');              
              var txt         = localStorage['node-forge'];
                            
              if(!txt){
                    var url   = 'https://cdn.jsdelivr.net/npm/node-forge/+esm';
                                                                                console.log(url);
                    var res   = await fetch(url);
                    txt       = await res.text();
                    localStorage['node-forge']    = txt;
              }
              
              var blob        = new Blob([txt],{type:'text/javascript'});
              var url         = window.URL.createObjectURL(blob);
              var nodeforge   = await import(url);
              pki             = nodeforge.default.pki;
                                                                                console.log(pki);
        }//load


```


