

        var mod   = create();

        function create(name){

              var mod         = {};
              mod.df          = true;
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

              
              async function build({root,mod:mod2}={}){
                
                    root      ||= document.body;
                    mod2      ||= mod;
                    
                    var list    = $(root,'[component]');
                    console.log(list);
                    list        = list.map((node,i)=>{
                      
                                        let complete    = ({node:custom})=>{
                                          
                                                                list.splice(i,1,{node,custom});
                                                                mod2.stack.add;
                                                                build({node:custom,mod:mod2});
                                                                
                                                          }//complete
                                        var promise     = loader({root:node,mod:mod2}).then(complete);
                                        return promise;
                                        
                                  });
                    await Promise.all(list);
                    mod2.stack.complete;
                    return list;
                    
                    
                    /*
                    list        = list.filter(node=>node.matches('[component]'));
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
                                if(node.hasAttribute('component')){debugger;
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
                    */
                    
              }//build
              
              
              async function loader({root,mod}){

                    var nn        = root.nodeName.toLowerCase();
                    var type      = loader.rd(root,'component','libs');
                    root.removeAttribute('component');
                    var version   = loader.rd(root,'v');
                    var slots     = [...root.childNodes];                    
                                                                                mod.df && console.log(root,nn);
                    switch(type){
                      
                      case 'libs'   : ({html}   = await loader.libs({nn,version}));       break;
                      case 'grp'    : ({html}   = await loader.grp({nn,version}));        break;
                      
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
                    
                    var list    = $(node,'script');
                    //list        = list.filter(node=>node.matches('script'));
                    //var list              = node.querySelectorAll('script');
                    
                    list.forEach(script=>{
                    
                          if(script.src){
                                                                                mod.df && console.log('script.src',script.src,script.parentNode.nodeName);
                                mod.stack.add;
                                var nscript   = document.createElement('script');
                                var src       = script.src;
                                if(script.hasAttribute('html-loader')){
                                      var attr    = script.getAttribute('html-loader');
                                      if(attr){
                                            return;
                                      }
                                      var id    = gen();
                                      nscript.setAttribute('html-loader',id);
                                      src  += `?[html-loader=${id}]`;
                                }
                                nscript.src           = src;
                                nscript.onload        = ()=>mod.stack.complete;
                                script.parentNode.replaceChild(nscript,script);
                          }else{
                                                                                mod.df && console.log('script.id',script.id);
                                                                                //debugger;
                                var js    = script.textContent;
                                eval(js);
                          }
                          
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

              
              loader.libs   = async function({nn,version}){
                
                    var url;
                    if(!version){
                          url           = `https://libs.ext-code.com/html/${nn}/${nn}.html`;
                    }else{
                          url           = `https://libs.ext-code.com/html/${nn}/v${version}/${nn}-v${version}.html`;
                    }
                    var {html,error}    = await loader.fetch(url);    
                    return {html,error};
                    
              }//libs
              
              
              loader.grp    = async function({nn,version}){
                                                                                console.log('loader.grp',nn,version);
                    /*                                                                                
                    var path    = window.location.pathname;
                                                                                console.log(path);
                    var base    = document.querySelector('base');
                    if(base){
                          var href    = base.href;
                          var url     = new URL(href);
                          path        = url.pathname;
                    }else{
                          if(path==='srcdoc'){
                                path    = window.location.pathname;
                          }
                    }
                    path    = path.slice(1);
                    path    = slashes(path,2);
                    */
                    var path;
                    if(!version){
                          path   = `../html/${nn}/${nn}.html`;
                    }else{
                          path   = `../html/${nn}/v${version}/${nn}-v${version}.html`;
                    }
                                                                                console.log(path);
                    var {html,error}    = await loader.fetch(path);    
                    return {html,error};
                    
              }//grp

              
              loader.fetch    = async function(url){
                
                    var res     = await fetch(url);
                    var html    = await res.text();
                    return {html};
                
              }//fetch
              

  //:

  
              function $(root,css){
                
                    var list    = [root];
                    var nodes   = [];
                    while(list.length){
                      
                          let node    = list.shift();
                          
                          if(!node.assignedSlot){
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
                                
                                if(node.matches && node.matches(css)){
                                      nodes.push(node);
                                }
                          }
                          
                    }//while
                    return nodes;
                    
              }//$
              
              
              function slashes(path,num){
              
                    var index   = path.length;
                    for(var i=0;i<num;i++){
                    
                          index   = path.lastIndexOf('/',index);
                          if(i<num-1){
                                index--;
                          }
                          
                    }//for
                    path    = path.slice(0,index+1);
                    return path;
                    
              }//getslash

  
              function gen(n=17){
                
                    var str     = '';
                    var c       = '0123456789';
                    var index   = ()=>Math.floor(Math.random()*10);
                    
                    for(var j=0;j<n;j++){
                      
                          var i   = index();
                          str    += c[i];
                          
                    }//for
                    
                    str   = 'x'+str;
                    return str;
                
              }//gen

              
              return mod;
      
        }//create
        











