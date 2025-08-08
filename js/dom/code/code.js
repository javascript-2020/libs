


(()=>{

  var obj   = {};
  
  
        obj.snippet_console   = snippet.console;


  
  
        async function load(rootnode,css){
          
              var list    = $.all(rootnode,`code[${css}]`);
              list        = list.map(load);
              await Promise.all(list);
              
              async function load(code){
                
                    var fn    = code.getAttribute(css);
                    if(!fn)return;
                    
                    var fn              = fn+'.js';
                    var err;
                    try{
                      
                          var res             = await fetch(fn);
                          
                    }
                    catch(err2){
                      
                          err   = err2;
                    
                    }
                    if(err){
                            console.error(err);
                            return;
                    }
                    
                    if(!res.ok){
                            var txt   = await res.text();
                            console.log(txt);
                            return;
                    }
                    
                    var txt             = await res.text();
                    code.textContent    = txt;
                          
              }//load
              
        }//load

  
        snippet_console.all   = async function(rootnode){

              await load(root,'snippet-console');
          
              var list    = $.all(rootnode,'code[snippet-console]');
              list.forEach(code=>snippet_console(code));
              
        }//all

        
        function snippet_console(code){
      
              init.stack.add;
              init.stack.push(complete);

              var editor      = $.editor.max(code,{kd});


              var node        = document.createElement('snippet-console');
              node.setAttribute('api','');
              code.after(node);
                            
              var script      = document.createElement('script');
              script.toggleAttribute('html-loader',true);
              script.src      = 'https://html-loader-1024713184986.us-central1.run.app/';
              script.onload   = onload;              
              
              node.append(script);
              
              
              function onload(){
              
                    init.stack.complete;
                    
              }//onload
              
              
              async function complete(){
                
                    var snippet   = mod['snippet-console']();
              
                    snippet.initmod({ext,$,source});
                    
                    await snippet.init();
                    
                    var node    = code.nextElementSibling;
                    snippet.initdom(node);
                    
              }//onload
              
                            
              function source(){
                
                    var txt   = editor.getValue();
                    return txt;
                    
              }//source


              function kd(e){
                
                    if(e.key==='Enter' && e.ctrlKey){
                          snippet.run();
                    }
                    
              }//kd
        
        }//snippet_console
        
        
  
  
  return obj;
  
})();