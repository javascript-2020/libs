

        var mod   = create();

        function create(name){

              var mod         = {};
              mod.create      = create;
              mod.build       = build;
              
              var stack       = [];
              mod.stack       = stack;
              
              var ct          = 0;
              var total       = 0;

      
              
              Object.defineProperty(stack,'add',{
                    get:()=>{
                
                          total++;
                                                                                      if(mod.stack.df){
                                                                                            console.log('add',ct,total);
                                                                                      }
                    },//get
                    set:v=>{
              
                          total++;
                          stack.push(v);
                          
                    }//set
              });
              
              Object.defineProperty(stack,'complete',{get:()=>{
                
                    ct++;
                                                                                      if(mod.stack.df){
                                                                                            console.log('complete',ct,total);
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
                          
                                                                                if(!node.hasAttribute)debugger;
                          if(node.hasAttribute('html-loader-2')){
                                let index     = nodes.length;
                                var promise   = loader({root:node,mod:mod2}).then(({node:custom})=>nodes.splice(index,1,{root:node,node:custom}));
                                nodes.push(promise);
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
                    
                                                                                df && console.log(root,nn);
                    switch(type){
                      
                      case 'libs'   : ({html}   = await loader.libs(nn));       break;
                      
                    }//switch

                    html            = html.trim();
                    
                    var div         = document.createElement('div');
                    div.setHTMLUnsafe(txt);
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
              }//libs
              
              
              loader.fetch    = async function(url){
                
                    var res     = await fetch(url);
                    var html    = await res.text();
                    return {html};
                
              }//fetch
              
              
              
              return mod;
      
        }//create
        











