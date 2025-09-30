





mod.openssl   = function(params){
        
          var obj   = {};
          
              var initial;
              var snapshot;
              var fs    = {};
              obj.fs    = fs;
      
              
              obj.init    = function(){return init()}
              
              async function init(){
                                                                                console.log('init');
                    var Module    = {print,printErr,onRuntimeInitialized};
                    await EmscrJSR_openssl(Module);
                                                                                console.log(1);
                    return Module;
                    
                    
                    function print(txt){
                    
                          if(params.stdout){
                                params.stdout(txt);
                          }
                          //output.textContent   += txt+'\n';
                          
                    }//print
      
                    
                    function printErr(txt){
                    
                          if(params.stderr){
                                params.stderr(txt);
                          }
                          //output.textContent    += '[stderr] '+txt+'\n';
                          
                    }//printErr
      
                    
                    function onRuntimeInitialized(){
                                                                                      console.log("OpenSSL ready");
                                                                                      console.log(Module);
                            if(!initial){
                                                                                      console.log('initial');
                                  initial   = fs.snapshot(Module);
                            }
                            if(snapshot){
                                  fs.restore(Module,snapshot);
                            }
                            //resolve(Module);
                            
                    }//onRuntimeInitialized
                          
              }//init
              
              
              
              obj.run   = async function(){
              
                    var Module    = await init();
                    
                    Module.callMain([...arguments]);
                    snapshot    = fs.snapshot(Module);
                    
                    return Module;
                    
              }//run
        
      
      
              fs.snapshot   = function(Module,path='/'){
                                                                                      //console.log('fs.snapshot');
                    var snapshot    = {};
                    var entries     = Module.FS.readdir(path);
                  
                    entries.forEach((entry) => {
                    
                          if(entry==='.'||entry==='..')return;
                          
                          var fullPath    = path+entry;
                                                                                      //console.log('fullpath',fullPath);
                          try{
                          
                                var stats   = Module.FS.stat(fullPath);
                            
                                if(Module.FS.isFile(stats.mode)){
                                                                                      //console.log('fullpath',fullPath);
                                      var uint8             = Module.FS.readFile(fullPath);
                                      snapshot[fullPath]    = uint8;
                                }
                                if(Module.FS.isDir(stats.mode)){
                                      Object.assign(snapshot,fs.snapshot(Module,fullPath+'/')); // recurse
                                }
                                
                          }//try
                          catch(err){
                          }//catch
                      
                    });
                  
                    return snapshot;
                    
              }//snapshotfs
              
              
              fs.restore    = function(Module,snapshot){
                                                                                //console.log('fs.restore');
                    Object.entries(snapshot).forEach(([path,content])=>{
                    
                          var parts     = path.split("/").slice(1,-1);
                          var current   = "/";
                          
                          parts.forEach((part) => {
                          
                                var next    = current+'/'+part;
                                
                                try{
                                
                                      Module.FS.mkdir(next);
                                      
                                }//try
                                catch(err){
                                                                          // already exists
                                }//catch
                                
                                current   = next;
                          });
                                                                                //console.log(path);
                          Module.FS.writeFile(path,content);
                          
                    });
                    
              }//restore
              
              
              fs.save    = function(Module){
              
                    var snap    = fs.snapshot(Module);
                    snapshot    = snap;
                    return snap;
                    
              }//store

              
              fs.set    = function(snap){
              
                    snapshot    = snap;
                    
              }//fs.set
              
              
              fs.diff   = function(snap1,snap2){
              
                    var k1        = Object.keys(snap1);
                    var s1        = new Set(k1);
                    var k2        = Object.keys(snap2);
                    var s2        = new Set(k2);
                    var d         = s2.difference(s1);
                    var result    = {};
                    d.forEach(key=>result[key]=snap2[key]);
                    return result;
                    
              }//diff
              
              
              fs.complete   = function(){
              
                    var result    = fs.diff(initial,snapshot);
                    return result;
                    
              }//complete
              
              
              fs.clear    = function(){
              
                    initial   = null;
                    
              }//clear
              
              
          return obj;
        
        }//openssl







