





mod.openssl   = function(params={}){

  var obj   = {};
  
  
        var df=obj.df=false,did='openssl';
        
        
        var {EmscrJSR_openssl}    = params;
        
        var initial;
        var snapshot;
        
        
        var fs    = {};
        obj.fs    = fs;
        
        
  //:
  
  
        obj.init    = function({url}={}){return init({url})}
        
        async function init({url}={}){
                                                                                debug.log('init');
              url         ||= params.url;
              var Module    = {print,printErr,onRuntimeInitialized,url};
              
              await EmscrJSR_openssl(Module);
                                                                                debug.log('init.complete');
              return Module;
              
              
              function print(txt){
              
                    if(params.stdout){
                          params.stdout(txt);
                    }
                    
              }//print
              
              
              function printErr(txt){
              
                    if(params.stderr){
                          params.stderr(txt);
                    }
                    
              }//printErr
              
              
              function onRuntimeInitialized(){
                                                                                debug.log("OpenSSL ready");
                                                                                debug.log(Module);
                      if(!initial){
                                                                                debug.log('initial');
                            initial   = fs.snapshot(Module);
                      }
                      if(snapshot){
                                                                                debug.log('snapshot');
                            fs.restore(Module,snapshot);
                      }
                      
              }//onRuntimeInitialized
              
        }//init
        
        
  //:
  
  
        obj.run   = async function(){
                                                                                debug.log('run',...arguments);
              var Module    = await init();
              
              Module.callMain([...arguments]);
              snapshot    = fs.snapshot(Module);
              
              return Module;
              
        }//run
        
        
  //:
  
  
        fs.snapshot   = function(Module,path='/'){
                                                                                //debug.log('fs.snapshot');
              var snapshot    = {};
              var entries     = Module.FS.readdir(path);
              
              entries.forEach((entry) => {
              
                    if(entry==='.'||entry==='..')return;
                    
                    var fullPath    = path+entry;
                                                                                //debug.log('fullpath',fullPath);
                    try{
                    
                          var stats   = Module.FS.stat(fullPath);
                          
                          if(Module.FS.isFile(stats.mode)){
                                                                                //debug.log('fullpath',fullPath);
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
                                                                                debug.log('fs.restore');
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
                                                                                debug.log(path);
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
        
        
        
  //:
  
  
        obj.normalisePem    = normalise_pem;
        obj.normalizePem    = normalise_pem;
        obj.normalise_pem   = normalise_pem;
        
        function normalise_pem(pem){
        
              pem         = pem.replace(/\r/g,'');
              var lines   = pem.split('\n');
              var n       = lines.length;
              for(var i=1;i<n-1;i++){
              
                    var line    = lines[i];
                    line        = line.trimStart();
                    lines[i]     = line;
                    
              }//for
              pem   = lines.join('\n').trim();
              return pem;
              
        }//normalise_pem
        
        
        
  //:
  
  
        function debug(...args){
        
              if(!df && !obj.df)return;
              args.unshift(`[ ${did} ]`);
              var fmt     = Array.from({length:args.length}).fill('%O').join(' ');
              var args2   = [fmt].concat(args);
              console.groupCollapsed.apply(console,args2);
              console.trace();
              console.groupEnd();
              
        }//debug
        
        
        debug.log   = function(){debug.apply(null,arguments)}
        
        
        debug.json    = function(v){
        
              var err;
              try{
              
                    var str   = JSON.stringify(v,null,4);
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = err.toString();
                    debug(error);
              }else{
                    debug(str);
              }
              
        }//json
        
        
  //:
  
  
  return obj;
  
}//openssl







