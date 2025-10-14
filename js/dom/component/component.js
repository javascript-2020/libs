
        var mod;
        
(()=>{
  
        var mod_list    = [];
        var cache       = {};
        
        mod   = create({name:'root'});
        
        window.addEventListener('load',onload);


        function onload(){

              
              if(typeof init!='undefined'){
                    if(!mod.stack.includes(init)){
                                                                                console.log('init added');
                          mod.stack.unshift(init);
                    }
              }
              
              var root    = document.body;
              mod.build({root,mod});
              
        }//onload


        function create({mod:par,name}={}){
                                                                                console.log('mod.create',name);
              var mod         = {};
              
              mod_list.push(mod);
              
              mod.name        = name;
              mod.df          = false;//(name==='root');
              mod.list        = mod_list;
              mod.child       = [];
              
              mod.create      = create;
              mod.build       = build;
              
              var stack       = []
              mod.stack       = stack;
              
              var ct          = 0;
              var total       = 0;

              
              
              if(par){
                    mod.par   = par;
                    par.child.push(mod);                    
                    par.stack.add;
                    mod.stack.push(()=>par.stack.complete);
              }else{
                                                                                console.log('auto total');
                    total    = 1;
                    
              }
              
                            
              Object.defineProperty(stack,'add',{
                    get:()=>{
                
                          total++;
                                                                                      debug.trace('add',name,ct,total);
                    },//get
                    set:v=>{
                      
                          
                          if(!par){
                                if(typeof v=='function'){
                                      if(v.name=='init'){
                                                                                      console.log('init hit');
                                            return;
                                      }
                                }
                          }
                          
                          
                          total++;
                          stack.push(v);
                                                                                      debug.trace('add',name,ct,total);
                    }//set
              });
              
              Object.defineProperty(stack,'complete',{get:()=>{
                
                    ct++;
                                                                                      debug.trace('complete',name,ct,total);
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
                
                    //root      ||= document.body;
                    //mod2      ||= mod;
                                                                                debug(mod2.name,'build');
                    
                    /*
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
                    
                    
                    */
                    //list        = list.filter(node=>node.matches('[component]'));
                    
                    
                    
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
                                                                                      
                                if(node.hasAttribute){
                                      if(node.hasAttribute('component')){
                                            let name        = node.nodeName.toLowerCase();
                                            let mod3        = mod2.create({mod:mod2,name});
                                            let index       = nodes.length;
                                            let complete    = async({node:custom})=>{
                                              
                                                                    nodes.splice(index,1,{node,custom});
                                                                    mod3.stack.add;
                                                                    await build({root:custom,mod:mod3});
                                                                    resolve();
                                                                    
                                                              }//complete
                                            //var promise   = loader({root:node,mod:mod2,mod2:mod3}).then(complete);
                                            
                                            let resolve,promise=new Promise(res=>resolve=res);
                                            loader({root:node,mod:mod2,mod2:mod3}).then(complete);
                                            
                                            nodes.push(promise);
                                      }
                                }
                                
                          }
                    
                    }//while
                    await Promise.all(nodes);
                    
                                                                                debug('build.complete',mod2.name,root.nodeName);
                    mod2.stack.complete;
                    
                    return nodes;
                    
                    
              }//build
              
              
              async function loader({root,mod,mod2}){

                    var {nn,inst}   =  rd.root(root);
                    
                    var type      = rd(root,'component','libs');
                    root.removeAttribute('component');
                    var version   = rd.version(root);
                    var slots     = [...root.childNodes];                    
                    
                    var url;
                    
                    switch(type){
                      
                      case 'libs'       : ({url}   = await loader.libs({root,nn,version}));          break;
                      case 'grp'        : ({url}   = await loader.grp({root,nn,version}));           break;
                      case 'parent'     : ({url}   = await loader.parent({root,nn,version}));        break;
                      case 'page'       : ({url}   = await loader.page({root,nn,version}));          break;
                      
                    }//switch

                    var {html,error}    = await loader.fetch(url);
                    if(error){
                                                                                console.error(error);
                          return;
                    }
                                                                                if(!html.trim)debugger;
                    html            = html.trim();
                    
                    var div         = document.createElement('div');
                    div.setHTMLUnsafe(html);
                    var node        = div.firstElementChild;
                                                                                if(!node)debugger;
                    root.__root     = node;
                    root.__node     = node;
                    
                    node.__html     = html;
                    node.__root     = root;
                    
                    node.setAttribute('url',url);

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
                                                                                if(!root.parentNode)debugger;
                    root.parentNode.replaceChild(node,root);
                                                                                mod.df && console.log(nn,version,root,node);
                                                                                //if(nn=='filemod')debugger;
                    
                    
                    var list    = $(node,'script');
                                                                                //console.log('script',list);
                    list.forEach(script=>{
                    
                          if(script.src){
                                                                                //mod.df && console.log('script.src',script.src,script.parentNode.nodeName);
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
                                                                                //console.log('script.id',script.id,mod,mod2);
                                                                                //debugger;
                                var js    = script.textContent;
                                define({js,mod,mod2,node,root,inst});
                          }
                          
                    });

                    return {node};
                    
              }//loader


              loader.libs   = async function({root,nn,version}){
                
                    var url;
                    if(!version){
                          url           = `https://libs.ext-code.com/html/${nn}/${nn}.html`;
                    }else{
                          url           = `https://libs.ext-code.com/html/${nn}/${version}/${nn}-${version}.html`;
                    }
                    return {url};
                    
                    var {html,error}    = await loader.fetch(url);    
                    return {html,url,error};
                    
              }//libs
              
              
              loader.grp    = async function({root,nn,version}){
                                                                                //console.log('loader.grp',nn,version);
                    var par   = loader.fn.par();

                    var url;
                    if(!version){
                          url   = `../html/${nn}/${nn}.html`;
                    }else{
                          url   = `../html/${nn}/${version}/${nn}-${version}.html`;
                    }
                    
                    url   = par+url;
                                                                                //console.log(url);
                    return {url};
                    
              }//grp


              loader.parent   = async function({root,nn,version}){
                
                    var parent    = rd(root,'parent');
                    var par       = $.parent(root,parent);
                    var pversion    = rd.version(par);
                    var url       = rd(par,'url');

                    var num       = 1;
                    if(pversion){
                          num   = 2;
                    }
                    url           = slashes(url,num);
                    
                    
                    var src;
                    if(version){
                          src     = `html/${nn}/${version}/${nn}-${version}.html`;
                    }else{
                          src     = `html/${nn}/${nn}.html`;
                    }
                    
                    url          += src;
                    
                    return {url};
                    
                    var {html,error}    = await loader.fetch(url);
                    return {html,url,error};
                
              }//parent
              
              
              loader.page   = async function({root,nn,version}){

                    var df;
                    if(nn=='output')df=true;
                    var par   = loader.fn.par(df);
                                                                                df && console.log('par',par);
                    var url;
                    if(version){
                          url   = `html/${nn}/${version}/${nn}-${version}.html`;
                    }else{
                          url   = `html/${nn}/${nn}.html`;
                    }
                    
                    url   = par+url;
                    
                    return {url};
                    
              }//page
              
              
              loader.fetch    = async function(url){
                
                    var html;
                    if(cache[url]){
                          if(cache[url].html){
                                                                                //console.log('component.cache [hit]',url);
                                html    = cache[url];
                          }else{
                                html    = await cache[url].promise;
                          }
                    }else{
                                                                                //console.log('component.cache',url);
                          cache[url]            = {};
                          cache[url].promise    = new Promise(res=>cache[url].resolve=res);
                          
                          var res   = await fetch(url);
                          html      = await res.text();
                    
                          cache[url].html   = html;
                          cache[url].resolve(html);
                    }
                                                                                //console.log(Object.keys(cache));
                    return {html};
                
              }//fetch
              
              
              loader.fn   = {};
              
              loader.fn.par   = function(df){
                
                    var par     = '';
                    
                    var path    = window.location.pathname;
                    var base    = document.querySelector('base');
                    if(base){
                          var href    = base.href;
                          var url     = new URL(href);
                          path        = url.pathname;
                    }else{
                          if(path==='srcdoc'){
                                path        = window.parent.location.pathname;
                          }
                    }
                                                                                df && console.log(path,base);                    
                    path        = path.slice(1);
                    var i       = path.lastIndexOf('/');
                    path        = path.slice(0,i);
                    
                    var dirs    = path.split('/');
                                                                                df && console.log('dirs',dirs);
                    var last    = dirs.at(-1);
                                                                                df && console.log('last',last);
                    if(last[0]=='v'){
                          var l   = last[1];
                          if(l>='0' && l<='9'){
                                par   = '../';
                          }
                    }
                    return par;
                    
              }//par
              

  //:


              function define({js,mod,mod2,node,root,inst}){
                
                    js    = `
                          //(()=>{return
                          
                                ${js}
                                
                          //})();
                    `;
                    
                    var fn        = eval(js);
                    var obj       = fn({mod:mod2,root,node});
                    var name      = root.nodeName.toLowerCase();
                    if(inst){
                          name   += `[${inst}]`;
                    }
                    mod[name]     = obj;
                    mod[inst]     = obj;

              }//define


  
              function $(root,css){
                
                    var list    = [root];
                    var nodes   = [];
                    while(list.length){
                      
                          let node    = list.shift();
                          
                          //if(!node.assignedSlot){
                                if(node.shadowRoot){
                                      list.push(node.shadowRoot);
                                }
                                      
                                if(node.nodeName=='SLOT'){
                                      list    = list.concat(node.assignedNodes());
                                }
                                      
                                node.childNodes.forEach(child=>{
                                  
                                      //if(child.assignedSlot)return;
                                      list.push(child);
                                      
                                });
                                      
                                if(node.matches && node.matches(css)){
                                      if(!nodes.includes(node)){
                                            nodes.push(node);
                                      }
                                }
                          //}
                          
                    }//while
                    return nodes;
                    
              }//$


              $.parent    = function(node,parent){
              
                    var ec    = true;
                    
                    while(ec){
                    
                          if(node.matches){
                                if(node.matches(parent)){
                                      return node;
                                }
                          }
                          
                          var par   = node.parentNode;
                          if(!par){
                                if(node.host){
                                      par   = node.host;
                                }
                          }
                          node    = par;
                          if(!node){
                                ec    = false;
                          }
                          
                    }//while
                    
                    return null;
              
              }//$_parent
              
              
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
                    
              }//slashes

  
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

              
              function rd(node,name,def){
              
                    var v   = def;
                    if(node.hasAttribute(name)){
                          v   = node.getAttribute(name)||v;
                    }
                    return v;
                    
              }//rd
              
              
              rd.version    = function(node){
                
                    for(var attr of node.attributes){
                    
                          var name    = attr.name;
                          if(name[0]=='v'){
                                var n1    = name[1];
                                if(n1>='0' && n1<='9'){
                                      return name;
                                }
                                
                          }
                          
                    }//for
                    
              }//version
              
              
              rd.root   = function(root){
                
                    var nn    = root.nodeName.toLowerCase();
                    var inst;
                    
                    inst    = rd(root,'inst');
                    if(inst){
                          return {nn,inst};
                    }

                    var id    = rd(root,'id');
                    if(id){
                          return {nn,inst:id};
                    }
                      
                    if(nn.endsWith(']')){
                          var i   = nn.lastIndexOf('[',nn.length);
                          if(i!=-1){
                                inst    = nn.slice(i+1,-1);
                                nn      = nn.slice(0,i);
                                return {nn,inst};
                          }
                    }
                    
                    return {nn,inst};
                    
              }//inst
              
              
  //:
  
  
              function debug(){
                
                    if(!mod.df)return;
                    var str   = [...arguments].join(' ');
                    console.log(`[ ${name} ]`,str);
                    
              }//debug
              
              
              debug.trace   = function(){
                
                    if(!mod.df)return;
                    debug.apply(null,arguments);
                    
                    console.groupCollapsed(`[ ${name} ]`);
                    console.trace();
                    console.groupEnd();
                    
              }//trace
  
              
          return mod;
      
        }//create
        
        
        
})();







