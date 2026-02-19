

/*
create-archive.js

26-02-18


*/

        export {create_archive};
        
        async function create_archive(dir,{download=true,test,df=false,def}={}){
                                                                                df && console.log('download',download);
                                                                                df && console.log('test',!!test);
                                                                                df && console.log(JSON.stringify(dir,null,4));
                                                                                df && console.log();
              if(!jszip){
                    jszip   = await import('https://cdn.jsdelivr.net/npm/jszip/+esm');
                    jszip   = jszip.default;
              }
              
              var zip;
              if(!test){
                    zip   = new jszip();
              }
              
              var resolve,promise=new Promise(res=>resolve=res);
              var ct=0,total=0;
              add(dir);
              await promise;
              
              var blob;
              if(zip){
                    blob      = await zip.generateAsync({type:'blob'});
                    
                    if(download){
                          var url       = window.URL.createObjectURL(blob);
                          var a         = document.createElement('a');
                          a.download    = download;
                          a.href        = url;
                          a.click();
                    }
              }
              return blob;
              
              
              async function add(dir,abs=''){
              
                    for(let key in dir){
                    
                          ct++;
                          var o   = dir[key];
                          
                          if(o.directory){
                                                                                df && console.log('dir :',abs+key);
                                if(zip){
                                      zip.folder(abs+key);
                                }
                                add(o.directory,abs+key+'/');
                                complete();
                          }
                          
                          if(o.file?.contents){
                                                                                df && console.log('file create :',abs+key);
                                if(zip){
                                      zip.file(abs+key,o.file.contents);
                                }
                                complete();
                          }
                          
                          if(o.file?.github){
                                var owner,repo,branch,path;
                                if(typeof o.file.github=='string'){
                                      path    = o.file.github;
                                }else{
                                      ({owner,repo,branch,path}    = o.file.github);
                                }
                                owner     ||= def.owner||'javascript-2020';
                                repo      ||= def.repo||'libs';
                                branch    ||= def.branch||'main';
                                if(path.startsWith('/')){
                                      path    = path.slice(1);
                                }
                                                                                df && console.log('file github :',abs+key);
                                                                                df && console.log(owner,repo,branch,path);
                                if(zip){
                                      fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`)
                                        .then(res=>res.text().then(txt=>{
                                        
                                              zip.file(abs+key,txt);
                                              complete();
                                              
                                        }));
                                }
                          }
                          
                          
                    }//for
                    
                    
                    function complete(){
                    
                          total++;
                          if(ct==total){
                                resolve();
                          }
                          
                    }//complete
                    
              }//add
              
              
              
        }//create_archive
              

      
