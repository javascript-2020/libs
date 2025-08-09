


(()=>{

  var obj   = {};
  
        
        var ext,$,datatype
        ;
        
        obj.initmod   = function(params){
        
              ext             = params.ext;
              $               = params.$;
              datatype        = params.datatype;
              
        }//initmod


  //:

  
        obj.snippet_console       = snippet_console;
        obj.load                  = load;





        var create    = {};
        
        

  //:
  
  
        load.all    = async function(rootnode,css){
          
              var list    = $.all(rootnode,`code[${css}]`);
              list        = list.map(load);
              await Promise.all(list);
              
        }//all
        
        
        async function load(fn,code){
          
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
  

        create.component    = function(root,name,onload){
        
              var comp    = document.createElement(name);
              comp.toggleAttribute('api',true);
              root.parentNode.replaceChild(comp,root);

              var script    = create.script();
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
  
  
        snippet_console.all   = async function(rootnode){

              //await load.all(root,'snippet-console');
          
              var css     = 'snippet-console';
              var nodes   = $.all(rootnode,'code[snippet-console]');
              var list    = new Array(nodes.length);
              
              nodes       = nodes.map(async(code,i)=>list[i]    = await snippet_console(code));
              await Promise.all(list);
              
              return list;
              
        }//all

        
        function snippet_console(code,{menu}){
        
              var editor;
              var snippet;
              var node;
              var root;
              
              init.stack.add;
              init.stack.push(complete);
              
              var resolve,promise=new Promise(res=>resolve=res);
              setTimeout(fn,50);
              
              
              async function fn(){
              

                    if($.nodename(code)!='code'){
                          code    = $(code,'code');
                    }
                    
                    var css     = 'snippet-console';
                    var fn      = code.getAttribute(css);
                    if(fn){
                          fn    = fn+'.js';
                          await load(fn,code);
                    }

                    var promise;
                    ({root,promise}    = obj.editor.code(code,{menu}));
                    promise.then(result=>({editor}=result));
                    
                    //editor          = $.editor.max(code,{kd});
      
      
                    node            = document.createElement('snippet-console');
                    node.toggleAttribute('api',true);
                    code.after(node);
                                  
                    var script      = create.script(()=>init.stack.complete);
                    node.append(script);
                    
              }//fn
              
              
              async function complete(){
                
                    snippet   = mod['snippet-console']();
              
                    snippet.initmod({ext,$,source});
                    
                    await snippet.init();
                    
                    debugger;
                    //var node    = editor.root;      //code.nextElementSibling;
                    snippet.initdom(root);
                    
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
        


  //:
  
  
  
        obj.codeblock   = function(node,{menu}){
        
        
              var resolve,promise=new Promise(res=>resolve=res);
              

              var codeblock;


              
              init.stack.add;
              init.stack.push(complete);


              var div   = document.createElement('div');
              node.before(div);
              

              var script      = create.script(()=>init.stack.complete);
              node.append(script);
        
              return promise;

              
              async function complete(){
                
                    codeblock   = mod['code-block']();
              
                    codeblock.initmod({ext,$,code:obj,menu});
                    
                    await codeblock.init();
                    
                    var root    = div.nextElementSibling;
                    div.remove();
                    
                    codeblock.initdom(root);
                    
                    resolve({codeblock});
                    
              }//complete

        }//codeblock
  
  
  //:
  
        
        obj.editor    = {};
        
        obj.editor.code    = function(code,{menu,kd}){

              var editor;
              var txt     = code.textContent;
              var root    = create.component(code,'editor',()=>init.stack.complete);
              
              init.stack.add;
              init.stack.push(complete);

              var resolve,promise=new Promise(res=>resolve=res);
              
              return {promise,root};
              
              
              async function complete(){
              
                    editor    = mod.editor();
                    
                    editor.initmod({ext,$,datatype,menumod:menu});
                    
                    await editor.init();
                    await editor.initdom(root.__component,{fullsize:true});
                    
                    editor.set(txt);
                    
                    resolve({editor,root});
                    
              }//complete
              
        }//editor







        
        
  return obj;
  
})();