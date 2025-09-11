

        var mod   = create();

        function create(name){

              var mod         = {};
              mod.df          = false;
              mod.create      = create;
              mod.build       = build;
              
              var stack       = [];
              mod.stack       = stack;
              
              var ct          = 0;
              var total       = 0;

      
              
              Object.defineProperty(stack,'add',{
                    get:()=>{
                
                          total++;
                                                                                      if(mod.df){
                                                                                            console.log('add',ct,total);
                                                                                            //console.trace();
                                                                                      }
                    },//get
                    set:v=>{
                      
                          total++;
                          stack.push(v);
                                                                                      if(mod.df){
                                                                                            console.log('add',ct,total);
                                                                                            //console.trace();
                                                                                      }
                    }//set
              });
              
              Object.defineProperty(stack,'complete',{get:()=>{
                
                    ct++;
                                                                                      if(mod.df){
                                                                                            console.log('complete',ct,total);
                                                                                            //console.trace();
                                                                                      }
                    if(ct!=total){
                          return;
                    }
                    
                    ct              = 0;
                    total           = 0;
                    
                    var list        = [...stack];
                    stack.length    = 0;
                    list.forEach(fn=>fn());
                    
              }});

              
              async function build({root,mod:mod2}){
                
                    root      ||= document.body;
                    mod2      ||= mod;
                    
                    var list    = [root];
                    var nodes   = [];
                    while(list.length){
                      
                          let node    = list.shift();
                          
                          if(node.assignedSlot){
                                return;
                          }

                          if(node.shadowRoot){
                                list.push(node.shadowRoot);
                          }
                          
                          if(node.nodeName=='SLOT'){
                                list    = list.concat(node.assignedNodes());
                          }
                          
                          node.childNodes.forEach(child=>{
                            
                                if(child.assignedSlot)return;
                                list.push(child);
                                
                          });
                                                                                
                          if(node.hasAttribute){
                                if(node.hasAttribute('html-loader-2')){
                                      node.removeAttribute('html-loader-2');
                                      let index       = nodes.length;
                                      let complete    = ({node:custom})=>{
                                        
                                                              nodes.splice(index,1,{node,custom});
                                                              mod2.stack.add;
                                                              build({node:custom,mod:mod2});
                                                              
                                                        }//complete
                                      var promise     = loader({root:node,mod:mod2}).then(complete);
                                      nodes.push(promise);
                                }
                          }
                    
                    }//while
                    
                    await Promise.all(nodes);
                    
                    mod2.stack.complete;
                    
                    return nodes;
                    
              }//build
              
              
              async function loader({root,mod}){

                    var nn      = root.nodeName.toLowerCase();
                    var type    = loader.rd(root,'type','libs');
                    var slots   = [...root.childNodes];
                    
                                                                                mod.df && console.log(root,nn);
                    switch(type){
                      
                      case 'libs'   : ({html}   = await loader.libs({nn}));       break;
                      
                    }//switch

                    html            = html.trim();
                    
                    var div         = document.createElement('div');
                    div.setHTMLUnsafe(html);
                    var node        = div.firstElementChild;
                                                                                if(!node)debugger;
                    node.__html     = html;
                    node.__root     = root;
                    
                    root.__root     = node;

                    for(var attr of root.attributes){
                      
                          if(attr.value){
                                node.setAttribute(attr.name,attr.value);
                          }else{
                                node.toggleAttribute(attr.name,true);
                          }
                          
                    }//for
        
                    slots.forEach(slot=>{
                     
                          var nslot   = slot.cloneNode(true); 
                          node.append(nslot)
                          
                    });
        
                    root.parentNode.replaceChild(node,root);
                    
                    var list              = node.querySelectorAll('script');
                    list.forEach(script=>{
                    
                          var nscript                 = document.createElement('script');
                          if(script.src){
                                                                                mod.df && console.log('script.src',script.src);
                                var src   = script.src;
                                if(script.hasAttribute('html-loader')){
                                      var id    = gen();
                                      nscript.setAttribute('html-loader',id);
                                      src  += `?[html-loader=${id}]`;
                                }
                                nscript.src           = src;
                                nscript.onload        = ()=>mod.stack.complete;
                                mod.stack.add;
                          }else{
                                                                                mod.df && console.log('script.id',script.id);
                                                                                //debugger;
                                var js    = script.textContent;
                                eval(js);
                                //nscript.textContent   = script.textContent;
                          }
                          script.parentNode.replaceChild(nscript,script);
                          
                    });

                    return {node};
                    
              }//loader
              

              loader.rd   = function(node,name,def){
              
                    var v   = def;
                    if(node.hasAttribute(name)){
                          v   = node.getAttribute(name)||v;
                    }
                    return v;
                    
              }//rd

              
              loader.libs   = async function({nn}){
                
                    var url             = `https://libs.ext-code.com/html/${nn}/${nn}.html`;
                    var {html,error}    = await loader.fetch(url);    
                    return {html,error};
                    
              }//libs
              
              
              loader.fetch    = async function(url){
                
                    var res     = await fetch(url);
                    var html    = await res.text();
                    return {html};
                
              }//fetch
              
              
              
              return mod;
      
        }//create
        











