


(()=>{

  var obj   = {};
  
  
  
  //:
  
  
        obj.run           = run;
        obj.nodejs        = nodejs;
  
  
  //:
  
  
  
        function run(js,{clear,disp_result,console,ctx}={}){


              ctx   ||= {};

          
              eval(`
              
                    (()=>{
                    
                          ({${Object.keys(ctx).join(',')}}    = ctx);
                          
                          if(clear){
                                console.clear();
                          }
      
                          var result    = eval(js);
                          
                          if(disp_result){
                                dconsole.log('result :',result);
                          }
                          
                    })();
              
              `);

              
        }//sandbox


  //:
  
  
        async function nodejs(js,{clear,disp_result,console,ctx}={}){
          
              var resolve,promise=new Promise(res=>resolve=res);
              
              var iframe              = document.createElement('iframe');
              iframe.style.cssText    = '';
              iframe.onload           = onload;
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
                    resolve({code});
                    
              }//onload
              
        }//nodejs
        



  //:
  
        var srcdoc    = {};
        
        srcdoc.nodejs   = `

(()=>{

              window.console.log(123);
              window.console.log(window.crossOriginIsolated);
              
              var webcontainer;
              var console;
              
              async function init(params){
              
                    ({console}            = params);
                    
                    var {WebContainer}    = await import('https://cdn.jsdelivr.net/npm/@webcontainer/api/+esm');
                    webcontainer          = await WebContainer.boot();
                    
              }//init
      
              async function run(js){
              
                    await webcontainer.fs.writeFile('main.js',js);
              
                    var process   = await webcontainer.spawn('node',['main.js']);
                    var stream    = new WritableStream({write(data){console.log(data)}});
                    process.output.pipeTo(stream);
            
                    var code      = await process.exit;
                    if(code!=0){
                          console.log('an error occurred');
                    }
                    return code;
                    
              }//run

})();

        `;
        

  
  return obj;


})();



