


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

              
        }//run


  //:
  
  
        async function nodejs(js,{clear,disp_result,console,ctx}={}){
          
              var resolve,promise=new Promise(res=>resolve=res);
              
              var iframe              = document.createElement('iframe');
              iframe.style.cssText    = '';
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
        

  
  return obj;


})();



