


(()=>{

  var obj   = {
  };
  
        var df=false,did='sandbox';
        
  //:
  
  
        var iframe;
        
        obj.run           = run;
        obj.nodejs        = nodejs;
        obj.kill          = kill;
        
        
  //:
  
  
        var wrap    = {};
        
        wrap.js   = function(js){
        
              js    = `
              
                    (async()=>{
                    
                          try{
                          
                                ${js}
                                
                          }//try
                          catch(err2){
                          
                                err   = err2;
                                
                          }//catch
                          
                    })()
                    
              `;
              return js;
              
        }//js
        
        
        function kill(){
          debugger;
              if(!iframe)return;
              iframe.remove();
              
        }//kill
        
        
        async function run(js,{clear,disp_result,console,ctx}={}){
                                                                                debug('run');
                                                                                
              ctx   ||= {};
              js      = wrap.js(js);
              
              await eval(`
              
                    (async()=>{
                    
                          var {${Object.keys(ctx).join(',')}}    = ctx;
                          
                          if(clear){
                                console.clear();
                          }
                          
                          var err;
                          try{
                          
                                var result    = await eval(js);
                                
                          }//try
                          catch(err2){
                          
                                err   = err2;
                                
                          }//catch
                          
                          if(err){
                                console.error(err);
                                return;
                          }
                          
                          if(disp_result){
                                console.log('result :',result);
                          }
                          
                    })();
                    
              `);
              
              
        }//run
        
        
        
        run.iframe    = async function(js,{clear,disp_result,console,ctx,iframe}={}){
                                                                                debug('run.iframe');
              if(iframe){
                    iframe.remove();
              }
              
              var win;
              
              await create();
              var {result,error}    = await win.run(js,{clear,disp_result,console,ctx});
              
              return {iframe,result,error};
              
              
              function create(){
              
                    var resolve,promise=new Promise(res=>resolve=res);
                    
                    iframe          = document.createElement('iframe');
                    iframe.style.display    = 'none';
                    iframe.srcdoc   = '';
                    iframe.onload   = onload;
                    document.body.append(iframe);
                    
                    return promise;
                    
                    async function onload(){
                    
                          win   = iframe.contentWindow;
                          setup();
                          resolve({iframe});
                          
                    }//onload
                    
              }//create
              
              
              
              
              function setup(){
              
                    js        = wrap.js(js);
                    ctx     ||= {};
                    
                    win.onerror                       = onerror;
                    win.onunhandledpromiserejection   = onunhandledrejection;
                    
                    
                    var str   = Object.keys(ctx).join(',');
                    
                    win.eval(`console.log('sandbox',window.crossOriginIsolated`);
                    win.eval(`
                          async function run(js,{clear,disp_result,console,ctx}={}){
                          
                                var {${str}}    = ctx;
                                
                                if(clear){
                                      console.clear();
                                }
                                
                                var err;
                                try{
                                
                                      var result    = await eval(js);
                                      
                                }//try
                                catch(err2){
                                
                                      err   = err2;
                                      
                                }//catch
                                
                                if(err){
                                      console.error(err);
                                      return {error:err};
                                }
                                
                                if(disp_result){
                                      console.log('result :',result);
                                }
                                
                                return {result};
                                
                          }//run
                    `);
                    
                    
                    function onerror(msg,src,line,col,err){
                    
                          err   = norm(err||msg);
                                                                                console.error(err);
                          resolve({error:err});
                          
                    }//onerror
                    
                    
                    function onunhandledrejection(event){
                    
                          var err   = norm(event.reason);
                                                                                console.error(err);
                          resolve({error:err});
                          
                    }//onunhandledpromiserejection
                    
                    
                    function norm(err){
                    
                          if(Object.prototype.toString.call(err)==='[object Error]')return err;
                          if(typeof err=='string')return new Error(err);
                          
                          var str;
                          var err2;
                          try{
                          
                                str   = JSON.stringify(err);
                                
                          }//try
                          catch(err3){
                          
                                err2   = err3;
                                
                          }//catch
                          if(err2){
                                return err2;
                          }
                          return new Error(str);
                          
                    }//norm
                    
              }//setup
              
        }//iframe
        
        
  //:
  
  
        async function nodejs(js,{clear,disp_result,console,ctx,on}={}){
        
              var resolve,promise=new Promise(res=>resolve=res);
              
              var iframe              = document.createElement('iframe');
              iframe.style.cssText    = 'display:none;';
              iframe.onload           = onload;
              iframe.srcdoc           = '';
              document.body.append(iframe);
              
              return promise;
              
              
              async function onload(){
              
                    var doc               = iframe.contentDocument;
                    var win               = iframe.contentWindow;
                    
                    var script            = doc.createElement('script');
                    var js2               = fnstr(srcdoc.nodejs);
                    script.textContent    = js2
                    doc.head.append(script);
                    
                    await win.init({console,ctx,on});
                    await win.run(js);
                    
                    iframe.remove();
                    
                    resolve({code});
                    
              }//onload
              
        }//nodejs
        
        
  //:
  
  
        function fnstr(fn){
        
              var s     = fn.toString();
              var i1    = s.indexOf('{');
              var i2    = s.lastIndexOf('}');
              var str   = s.slice(i1+1,i2);
              return str;
              
        }//fnstr
        
        
        var srcdoc    = {};
        
        srcdoc.nodejs   = function(){
        
(()=>{


              var webcontainer;
              var terminal;
              var console;
              var on;
              var df;
              
              
              window.init   = async function(params={}){
              
                    var ctx;
                    ({console,ctx,on,df=true}    = params);
                    ctx           ||= {};
                    on            ||= {};
                    ({terminal}     = ctx);
                                                                                console.log('sandbox.nodejs');
                                                                                console.log('cross-origin-isolated : ',window.crossOriginIsolated);
                                                                                console.log();
                    if(!terminal){
                          terminal    = console;
                    }
                                                                                console.log('initialising ...');
                                                                                
                    var {WebContainer}    = await import('https://cdn.jsdelivr.net/npm/@webcontainer/api/+esm');
                                                                                console.log('ok');
                                                                                
                                                                                console.log('booting ...');
                    webcontainer          = await WebContainer.boot();
                                                                                console.log('ok');
                    await callback('init',{webcontainer});
                    //await on?.init?.({webcontainer});
                    
                    webcontainer.on('server-ready',async(port,url)=>{
                                                                                console.log('server : ',url,port);
                          await callback('server-ready',{port,url});
                          //on?.['server-ready']?.({port,url});
                          
                    });
                    
                    return webcontainer;
                    
              }//init
              
              
              window.run    = async function(js){
                                                                                console.log('write main.js ...');
                    await webcontainer.fs.writeFile('main.js',js);
                                                                                console.log('ok');
                                                                                
                                                                                console.log('launch process ...');
                    var process   = await webcontainer.spawn('node',['main.js']);
                                                                                console.log('ok');
                                                                                
                    var stream    = new WritableStream({write(data){terminal?.write(data)}});
                    process.output.pipeTo(stream);
                    
                    await callback('run',{process});
                    //await on?.run?.({process});
                    
                    var code      = await process.exit;
                    if(code!=0){
                                                                                console.warn('process exited with error code : ',code);
                    }
                    
                    await callback('complete',{code});
                    //await on?.complete?.({code});
                                                                                console.log('done.');
                    return {code};
                    
              }//run
              
              
              async function callback(name,...args){
              
                    if(!on[name]){
                          return;
                    }
                    
                    if(!Array.isArray(on[name])){
                          await on[name].apply(null,args);
                          return;
                    }
                    
                    var list    = on[name];
                    var n       = list.length;
                    for(var i=0;i<n;i++){
                    
                          var fn    = list[i];
                          await fn.apply(null,args);
                          
                    }//for
                    
              }//callback
              
              
              function debug(){
              
                    if(!df)return;
                    var str   = [...arguments].join(' ');
                    console.debug(str);
                    
              }//debug
              
              
              
})();

        }//nodejs
        
        
        
  //:
  
  
        obj.html    = function(){
        }//html
        
        
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
        
        
        
  return obj;
  
  
})();



