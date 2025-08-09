


(()=>{

  var obj   = {};
  
        
        var ext
        ;
        
        obj.initmod   = function(params){
        
              ext   = params.ext;
              
        }//initmod


  //:

  
        obj.snippet_console       = snippet_console;
        obj.load                  = load;
        

  //:
  
  
        load.all    = async function(rootnode,css){
          
              var list    = $.all(rootnode,`code[${css}]`);
              list        = list.map(load);
              await Promise.all(list);
              
        }//all
        
        
        async function load(code,css){
          
              var fn    = code.getAttribute(css);
              if(!fn)return;
              
              var fn          = fn+'.js';
              var err;
              try{
                
                    var res   = await fetch(fn);
                    
              }
              catch(err2){
                
                    err       = err2;
              
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
              
              return true;
              
        }//load
              
  
  //:
  
  
        snippet_console.all   = async function(rootnode){

              //await load.all(root,'snippet-console');
          
              var css     = 'snippet-console';
              var nodes   = $.all(rootnode,'code[snippet-console]');
              var list    = new Array(nodes.length);
              
              nodes       = nodes.map(async(code,i)=>list[i]    = await snippet_console(code,css));
              await Promise.all(list);
              
              return list;
              
        }//all

        
        function snippet_console(code,css){
        
              var editor;
              var snippet;
              var node;
              
              var resolve,promise=new Promise(res=>resolve=res);
              setTimeout(fn,50);
              return promise;
              
              
              async function fn(){
              
                    if($.nodename(code)!='code'){
                          code    = $(code,'code');
                    }
                    
                    await load(code,css);
                    
                    init.stack.add;
                    init.stack.push(complete);
      
                    editor      = $.editor.max(code,{kd});
                    snippet;
      
                    node        = document.createElement('snippet-console');
                    node.setAttribute('api','');
                    code.after(node);
                                  
                    var script      = document.createElement('script');
                    var id          = String(Math.random()).slice(2);
                    script.toggleAttribute('html-loader',id);
                    var src         = 'https://html-loader-1024713184986.us-central1.run.app/'
                    src            += `?[html-loader=${id}]`;
                    script.src      = src;
                    script.onload   = onload;              
                    
                    node.append(script);
                    
              }//fn
              
              
              function onload(){
              
                    init.stack.complete;
                    
              }//onload
              
              
              async function complete(){
                
                    snippet   = mod['snippet-console']();
              
                    snippet.initmod({ext,$,source});
                    
                    await snippet.init();
                    
                    var node    = code.nextElementSibling;
                    snippet.initdom(node);
                    
                    resolve({editor,snippet,code,node});
                    
              }//onload
              
                            
              function source(){
                
                    var txt   = editor.getValue();
                    return txt;
                    
              }//source
              
              
              source.focus    = ()=>{
              
                    editor.focus();
                    
              }//focus


              function kd(e){
                
                    if(e.key==='Enter' && e.ctrlKey){
                          snippet.run();
                    }
                    
              }//kd
        
        }//snippet_console
        


  //:
  
  
  
  
  
  return obj;
  
})();