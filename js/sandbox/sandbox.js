


(()=>{

  var obj   = {};
  
  
  
  //:
  
  
        obj.run           = run;
        obj.nodejs        = nodejs;
  
  
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
        
  
  
        async function run(js,{clear,disp_result,console,ctx}={}){


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
        
        
        
        run.iframe    = async function(js,{clear,disp_result,console,ctx}={}){

              var iframe;
              var win;
              
              await create();
              var {result,error}    = await win.run(js,{clear,disp_result,console,ctx});
              
              return {iframe,result,error};
              
              
              function create(){
                
                    var resolve,promise=new Promise(res=>resolve=res);
                    
                    iframe          = document.createElement('iframe');
                    iframe.srcdoc   = '';
                    iframe.onload   = onload;
                    document.body.append(iframe);
                    
                    return promise;
                    
                    async function onload(){
                      
                          win   = iframe.contentWindow;
                          setup();
                          resolve();
      
                    }//onload
              }//create
              
              
              
              
              function setup(){

                    js        = wrap.js();
                    ctx     ||= {};
                    
                    win.onerror                       = onerror;
                    win.onunhandledpromiserejection   = onunhandledrejection;
                
                
                    var str   = Object.keys(ctx).join(',');
                
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
                      
                          console.error(err);
                          resolve({error:err});
                          
                    }//onerror

                    
                    function onunhandledrejection(event){
                      
                          console.error('Unhandled rejection:',event.reason);
                          resolve({error:event.reason});
                          
                    }//onunhandledpromiserejection
              
              }//setup
              
        }//iframe
        

  //:
  
  
        async function nodejs(js,{clear,disp_result,console,ctx}={}){
          
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
                    script.textContent    = srcdoc.nodejs;
                    doc.head.append(script);
                    
                    await win.init({console});
                    
                    var code    = await win.run(js);
                    
                    iframe.remove();
                    
                    resolve({code});
                    
              }//onload
              
        }//nodejs
        

  //:

  
        var srcdoc    = {};
        
        srcdoc.nodejs   = `

(()=>{

                                                                                window.console.log('sandbox.nodejs');
                                                                                window.console.log(window.crossOriginIsolated);
              
              var webcontainer;
              var console;

              
              window.init   = async function(params){
                                                                                window.console.log(1);
              
                    ({console}            = params);
                    
                    var {WebContainer}    = await import('https://cdn.jsdelivr.net/npm/@webcontainer/api/+esm');
                                                                                window.console.log(2);
                    webcontainer          = await WebContainer.boot();
                                                                                window.console.log(3);
                    
              }//init

      
              window.run    = async function(js){
                                                                                window.console.log(1);
                    await webcontainer.fs.writeFile('main.js',js);
                                                                                window.console.log(2);
              
                    var process   = await webcontainer.spawn('node',['main.js']);
                                                                                window.console.log(3);
                    var stream    = new WritableStream({write(data){console.log(data)}});
                                                                                window.console.log(4);
                    process.output.pipeTo(stream);
                                                                                window.console.log(5);
            
                    var code      = await process.exit;
                    if(code!=0){
                          console.log('an error occurred');
                    }
                                                                                window.console.log(6);
                    return code;
                    
              }//run

})();

        `;
        


  //:
  
  
        obj.html    = function(){
        }//html
        
        
  //:
  


  
  return obj;


})();



