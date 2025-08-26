


(()=>{

  var obj   = {};
  
        
        var ext,$,datatype,menumod
        ;
        
        obj.initmod   = function(params){
        
              ext             = params.ext;
              $               = params.$;
              datatype        = params.datatype;
              menumod         = params.menumod;
              
        }//initmod


  //:

  
        obj.load                  = load;
        
        obj.snippet_console       = snippet_console;
        obj.snippet_html          = snippet_html;
        
        obj.code_block            = code_block;





        var create    = {};
        
        

  //:
  
  
        load.all    = async function(rootnode,css){
          
              var list    = $.all(rootnode,`code[${css}]`);
              list        = list.map(load);
              await Promise.all(list);
              
        }//all
        
        
        async function load(fn){
          
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
                                                                                //console.log(txt);
                      return;
              }
              
              var txt   = await res.text();
              return txt;
              
        }//load

              
  //:
  

        create.component    = function(root,name,onload){
        
              var comp    = document.createElement(name);
              comp.toggleAttribute('api',true);
              root.parentNode.replaceChild(comp,root);

              var script    = create.script(onload);
              comp.append(script);
              
              return comp;
                    
        }//component
        
        
        create.script   = function(onload){
        
              var script      = document.createElement('script');
              var n           = String(Math.random()).slice(2);
              var id          = 'x'+n;
              script.setAttribute('html-loader',id);
              var src         = 'https://html-loader-1024713184986.us-central1.run.app/'
              src            += `?[html-loader=${id}]`;
              script.src      = src;
              script.onload   = onload;              
              
              return script;

        }//script
        
        
  //:
  
  
        snippet_console.all   = async function(rootnode,{menu,ace}={}){

              //await load.all(root,'snippet-console');
          
              var css     = 'snippet-console';
              var nodes   = $.all(rootnode,'code[snippet-console]');
              var list    = new Array(nodes.length);
              
              nodes       = nodes.map(async(code,i)=>{
                
                    list[i]    = await snippet_console(code,{menu,ace});
                    
              });
              await Promise.all(list);
              
              return list;
              
        }//all

        
        function snippet_console(code,{menu,ace,mode}={}){
        
              var resolve,promise=new Promise(res=>resolve=res);
              setTimeout(fn,50);
              
              init.stack.add;
              init.stack.push(complete);

              
              var editor;
              var snippet;
              var node;
              var root;
              
              
              async function fn(){              

                    if($.nodename(code)!='code'){
                          code    = $(code,'code');
                    }
                    
                    var txt;
                    var fn      = code.getAttribute('src');
                    if(fn){
                          var i   = fn.lastIndexOf('.');
                          if(i==-1){
                                fn   += '.js';
                          }
                          txt   = await load(fn,code);
                    }
                    
                    if(txt){
                          code.textContent    = txt;
                    }


                    var promise;
                    ({root,promise}    = obj.editor.code(code,{menu,ace}));
                    promise.then(result=>({editor}=result));
                    
                    //editor          = $.editor.max(code,{kd});
      
      
                    node            = document.createElement('snippet-console');
                    node.toggleAttribute('api',true);
                    root.after(node);
                                  
                    var script      = create.script(()=>init.stack.complete);
                    node.append(script);
                    
              }//fn
              
              
              async function complete(){
                
                    snippet   = mod['snippet-console']();
              
                    snippet.initmod({ext,$,source,menumod,ace,mode});
                    
                    await snippet.init();

                    await snippet.initdom(node.__component);
                    
                    //snippet.initdom(node.__component);
                    
                    
                    
                    
                    resolve({editor,snippet,code,node});
                    
              }//complete
              
                            
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

              
              return promise;
        
        }//snippet_console
        

        function snippet_html(code,{}){
          
              var resolve,promise=new Promise(res=>resolve=res);
              setTimeout(fn,50);

              init.stack.add;
              init.stack.push(complete);

              var editor;
              var snippet;
              var node;
              var root;

              
              async function fn(){
                
                    if($.nodename(code)!='code'){
                          code    = $(code,'code');
                    }
                    
                    var txt;
                    var fn      = code.getAttribute('src');
                    if(fn){
                          var i   = fn.lastIndexOf('.');
                          if(i==-1){
                                fn   += '.js';
                          }
                          txt   = await load(fn,code);
                    }
                    
                    if(txt){
                          code.textContent    = txt;
                    }


                    var promise;
                    ({root,promise}    = obj.editor.code(code,{menu,ace}));
                    promise.then(result=>({editor}=result));

                    node            = document.createElement('snippet-html');
                    node.toggleAttribute('api',true);
                    root.after(node);
                                  
                    var script      = create.script(()=>init.stack.complete);
                    node.append(script);
                
              }//fn


              async function complete(){
                
                    snippet   = mod['snippet-html']();
              
                    snippet.initmod({ext,$,source,menumod,ace,mode});
                    
                    await snippet.init();

                    await snippet.initdom(node.__component);
                    
                    resolve({editor,snippet,code,node});
                    
              }//complete


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

              
              return promise;
              
        }//snippet_html
        
        
  //:

  
        code_block.all   = function(menu){
        }//all

      
        function code_block(node,{mode,menu,ace}){
        
        
              var resolve,promise=new Promise(res=>resolve=res);
              
              init.stack.add;
              init.stack.push(complete);


              var code_block;

              var div   = document.createElement('div');
              node.before(div);

              var script    = create.script(()=>init.stack.complete);
              node.append(script);

        
              return promise;

              
              async function complete(){
                
                    code_block   = mod['code-block']();
              
                    code_block.initmod({ext,$,code:obj,menu,ace});
                    
                    await code_block.init();
                    
                    var root    = div.nextElementSibling;
                    div.remove();
                    
                    await code_block.initdom(root,{mode});
                    
                    resolve({code_block});
                    
              }//complete

        }//code_block
  
  
  //:
  
        
        obj.editor    = {};
        
        obj.editor.code    = function(code,{mode,menu,kd,ace}){

              var editor;
              
              var resolve,promise=new Promise(res=>resolve=res);
              
              init.stack.add;
              init.stack.push(complete);
              
              var txt     = code.textContent;
              var root    = create.component(code,'editor',()=>init.stack.complete);
                            
              return {promise,root};
              
              
              async function complete(){
              
                    editor    = mod.editor();
                    
                    editor.initmod({ext,$,datatype,menumod,menu,fullsize:true,ace});
                    
                    await editor.init();
                    await editor.initdom(root.__component,{mode,txt});
                    
                    resolve({editor,root});
                    
              }//complete
              
        }//editor







        
        
  return obj;
  
})();