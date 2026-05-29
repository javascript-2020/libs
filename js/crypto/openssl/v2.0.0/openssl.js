


/*

openssl.js

27-05-26

*/


globalThis.opensslmod   = opensslmod;

if(typeof module!='undefined'){
      if(module.exports){
            module.exports    = opensslmod;
      }
}


opensslmod.fs     = null;
opensslmod.path   = null;


function opensslmod(params={}){

  var obj   = {};
  
  
        var df=obj.df=false,did='openssl';

        var platform            = typeof document=='undefined' ? 'node' : 'browser';
        
        var wasmJs;
        
        var wasmBinary;
        var wasmBinaryFile;
        
        var EmscrJSR_openssl;
        var stdout;
        var stderr;
        
        var echo                = true;


  //:

  
        initmod(params);
        
        obj.initmod   = initmod
        
        function initmod(params){
        
              ('stdout' in params) && (stdout=params.stdout);
              ('stderr' in params) && (stderr=params.stderr);
              
              ('EmscrJSR_openssl' in params) && (EmscrJSR_openssl=params.EmscrJSR_openssl);
              ('wasmJs' in params) && (wasmJs=params.wasmJs);
              ('wasmBinary' in params) && (wasmBinary=params.wasmBinary);
              ('wasmBinaryFile' in params) && (wasmBinaryFile=params.wasmBinaryFile);
              
              ('echo' in params) && (echo=params.echo);
              ('df' in params) && (df=params.df);
              
        }//initmod
        
        
  //:

  
        var def           = {};
        def.wasmJs        = 'https://javascript-2020.github.io/libs/js/external/openssl/openssl.js';
        

        var cur;
        var initial;
        var snapshot;
        
        
        var fs    = {};
        obj.fs    = fs;
        
        
        var libs    = {};
        
        
  //:
  

        obj.init    = init;
        
        async function init(){
                                                                                debug.log('init');
              await libs[platform]();
              
              if(cur){
                    fs.save();
              }
              
              var src       = wasmJs;
              var Module    = {print,printErr,onRuntimeInitialized,src,wasmBinary,wasmBinaryFile};
              cur           = Module;
              
              await EmscrJSR_openssl(Module);
              
              obj.FS        = Module.FS;
                                                                                debug.log('init.complete');
              return Module;
              
              
              function print(txt){
              
                    if(echo){
                                                                                console.log('[ stdout ]',txt);
                    }
                    
                    if(typeof stdout=='function'){
                          stdout(txt);
                    }
                    
              }//print
              
              
              function printErr(txt){
              
                    if(echo){
                                                                                console.log('[ stderr ]',txt);
                    }
                    
                    if(typeof stderr=='function'){
                          stderr(txt);
                    }
                    
              }//printErr
              
              
              function onRuntimeInitialized(){
                                                                                debug.log('OpenSSL ready');
                                                                                //debug.log(Module);
                      if(!initial){
                                                                                debug.log('initial');
                            initial   = fs.snapshot({Module});
                      }
                      if(snapshot){
                                                                                debug.log('snapshot');
                            fs.restore({Module,snapshot});
                      }
                      
              }//onRuntimeInitialized
              
        }//init
        
        
        libs.browser    = async function(){
                                                                                debug.log('libs.browser');
              if(!EmscrJSR_openssl){
                    wasmJs  ||= def.wasmJs;
                                                                                debug.log('wasmJs',wasmJs);
                    var txt   = await fetch(wasmJs).then(res=>res.text());
                    var js    = `
                                      (()=>{
                                      
                                            ${txt}
                                            
                                            return EmscrJSR_openssl;
                                            
                                      })();
                                `;
                    EmscrJSR_openssl    = eval(js);
              }
              
        }//libs
        
        
        libs.node   = async function(){
                                                                                debug.log('libs.node');
              var fs              = opensslmod.fs||require('node:fs');
              var path            = opensslmod.path||require('node:path');
            
              if(!wasmJs){
                    var tmp   = './openssl.wasm.js';
                    if(fs.existsSync(tmp)){
                          wasmJs    = tmp;
                    }
              }
              
              if(!wasmJs){
                    var dir   = opensslmod.__dirname||(__dirname+'/');
                    tmp       = dir+'openssl.wasm.js';
                    if(fs.existsSync(tmp)){
                          wasmJs    = tmp;
                    }
              }
              
              if(!wasmJs){
                    await libs.browser();
                    return;
              }
                                
              var cwd             = process.cwd();
              var abs             = path.resolve(cwd,wasmJs);
              var dir             = path.dirname(abs);              
              
              var txt             = fs.readFileSync(wasmJs,'utf8');
              var js              = `
                                          (()=>{
                                          
                                                ${txt}
                                                
                                                return EmscrJSR_openssl;
                                                
                                          })();
                                    `;
              EmscrJSR_openssl    = eval(js);
              
              wasmBinaryFile    ||= path.resolve(dir,'openssl.wasm');
              wasmBinary          = fs.readFileSync(wasmBinaryFile);
            
        }//node
        
        
  //:
  
  
        obj.run   = async function(...args){
                                                                                debug.log('run',...arguments);
              var n   = args.length;
              for(var i=0;i<n;i++){
              
                    var cmdline   = args[i];
                    var cmd       = cmdline.split(' ');
                    
                    if(cmd[0]==='openssl'){
                          cmd.shift();
                    }
                    
                    var Module    = await init();
                    Module.callMain(cmd);
                    snapshot    = fs.snapshot({Module});
                    
              }//for
              
              return {Module};
              
        }//run
        
        
        obj.download    = download;
        
        function download(v,{type}){
          
              var blob      = new Blob([v],{type});
              download_blob(blob);
          
        }//download
        
        
        obj.download.file   = function(path,{type}){
          
              var buf   = cur.FS.readFile(path);
              download(buf,{type});
              
        }//file
        
        
        obj.download.blob   = download_blob;
        
        function download_blob(blob){
          
              var url       = window.URL.createObjectURL(blob);
              var a         = document.createElement('a');
              a.href        = url;
              a.download    = name||'';
              a.click();
              
        }//blob
        
        
  //:
  
  
        fs.snapshot   = function({path='/',Module}={}){
                                                                                debug.log('fs.snapshot');
              Module        ||= cur;
              var snapshot    = {};
              var entries     = Module.FS.readdir(path);
              
              entries.forEach((entry) => {
              
                    if(entry==='.'||entry==='..')return;
                    
                    var fullPath    = path+entry;
                                                                                debug.log('fullpath',fullPath);
                    try{
                    
                          var stats   = Module.FS.stat(fullPath);
                          
                          if(Module.FS.isFile(stats.mode)){
                                                                                debug.log('fullpath',fullPath);
                                var uint8             = Module.FS.readFile(fullPath);
                                snapshot[fullPath]    = uint8;
                          }
                          if(Module.FS.isDir(stats.mode)){
                                Object.assign(snapshot,fs.snapshot({Module,path:fullPath+'/'})); // recurse
                          }
                          
                    }//try
                    catch(err){
                    }//catch
                    
              });
              
              return snapshot;
              
        }//snapshot
        
        
        
        
        fs.restore    = function({path='/',snapshot,Module}){
                                                                                debug.log('fs.restore');
              Module    ||= cur;
              var src     = path;
              
              Object.entries(snapshot).forEach(([path,content])=>{
              
                    var parts     = path.split('/').slice(1,-1);
                    var current   = src;
                    
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
        
        
        fs.save    = function({Module}={}){
        
              Module    ||= cur;
              var snap    = fs.snapshot({Module});
              snapshot    = snap;
              return snap;
              
        }//save
        
        
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
        
              initial     = null;
              snapshot    = null;
              
        }//clear
        
        
        
        
        
        
        
  //:
  
  
        obj.normalisePem    = normalise_pem;
        obj.normalizePem    = normalise_pem;
        obj.normalise_pem   = normalise_pem;
        obj.normalize_pem   = normalise_pem;
        
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
        
        
        obj.datatype    = datatype;
        
        function datatype(v){
          
              var str   = Object.prototype.toString.call(v);
              str       = str.slice(8,-1);
              str       = str.toLowerCase();
              return str;
              
        }//datatype
        
        
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
  
//openssl
}







