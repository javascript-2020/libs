


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
  

        create.script   = function(){
        
              var script      = document.createElement('script');
              var n           = String(Math.random()).slice(2);
              var id          = 'x'+n;
              script.setAttribute('html-loader',id);
              var src         = 'https://html-loader-1024713184986.us-central1.run.app/'
              src            += `?[html-loader=${id}]`;
              script.src      = src;
              script.onload   = onload;              
              
              return script;


              function onload(){
              
                    init.stack.complete;
                    
              }//onload
        
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

                    ({editor}   = obj.editor.code(code,{kd,source,menu}));
                    //editor          = $.editor.max(code,{kd});
      
      
                    node            = document.createElement('snippet-console');
                    node.toggleAttribute('api',true);
                    code.after(node);
                                  
                    var script      = create.script();
                    node.append(script);
                    
              }//fn
              
              
              async function complete(){
                
                    snippet   = mod['snippet-console']();
              
                    snippet.initmod({ext,$,source});
                    
                    await snippet.init();
                    
                    var node    = code.nextElementSibling;
                    snippet.initdom(node);
                    
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
              

              var script      = create.script();
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
        
        obj.editor.code    = function(code,{menu}){

              var editor;
              
              init.stack.add;
              init.stack.push(complete);

              var resolve,promise=new Promise(res=>resolve=res);
              setTimeout(fn,50);
              return promise;
              
              
              function fn(){
              
                    var txt     = code.textContent;
                    
                    var comp    = document.createElement('editor');
                    comp.toggleAttribute('api',true);
                    
                    code.parentNode.replaceNode(comp,code);
      
                    
                    var script    = create.script();
                    comp.append(script);
                    
              }//fn
              
              
              async function complete(){
              
                    editor    = mod.editor();
                    
                    editor.initmod({ext,$,datatype,menumod:menu,source});
                    
                    await editor.init();
                    
                    await editor.initdom(code,{fullsize:true});
                    
                    editor.set(txt);
                    
                    resolve({editor});
                    
              }//complete
              
        }//editor







        
        
  return obj;
  
})();