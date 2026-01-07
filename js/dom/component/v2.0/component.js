
        var mod;
        
(()=>{

        var full_list   = [];
        var cache       = {};
        
        mod             = create({name:'root'});
        var mod_root    = mod;
        
        window.addEventListener('load',onload);
        
        
        function onload(){
        
        
              if(typeof init=='function'){
                    if(!mod.stack.includes(init)){
                                                                                //console.log('init added');
                          mod.stack.unshift(init);
                    }
              }
              
              if(typeof init_hdr=='function'){
                    if(!mod.stack.includes(init_hdr)){
                          mod.stack.unshift(init_hdr);
                    }
              }
              
              var root    = document.body;
              mod.build({root,mod});
              
        }//onload
        
        
        function create({mod:par,name}={}){
                                                                                //console.log('mod.create',name);
              var mod               = {};
              
              mod.name              = name;
              
              mod.df                = false;
              //mod.df                = (name==='root');
              
              mod.par               = null;           //  mod
              mod.child             = [];             //  mod
              
              mod.list              = [];             // obj
              mod.full              = full_list;      // obj
              
              mod.auto              = auto;
              mod.create            = create;
              mod.build             = build;
              mod.rd                = rdparams;
              
              mod.rd.config         = rdconfig;
              mod.config            = parseconfig;
              
              mod.rd.attr           = rdattr;
              
              
              var stack             = []
              mod.stack             = stack;
              
              
              mod.base              = {};
              mod.base.add          = params=>{
                                                                                //console.log('mod.base.add');
                                                                                if(datatype(params)!='object')debugger;
                                            Object.assign(mod.base,params);
                                            
                                      }//add
                                      
              //mod.base.add({ext,$,datatype,keydown,menumod,menu,ace});
              
              
              full_list.push(mod);
              
              
              var ct          = 0;
              var total       = 0;
              
              
              
              if(par){
                    mod.par   = par;
                    par.child.push(mod);
                    par.stack.add;
                    mod.stack.push(()=>par.stack.complete);
              }else{
                                                                                //console.log('auto total');
                    total    = 1;
              }
              
              
              Object.defineProperty(stack,'add',{
                    get:()=>{
                    
                          total++;
                                                                                debug('add',ct,total);
                    },//get
                    set:v=>{
                    
                    
                          if(!par){
                                if(typeof v=='function'){
                                      if(v.name=='init'){
                                                                                //console.log('init hit');
                                            return;
                                      }
                                }
                          }
                          
                          
                          total++;
                          stack.push(v);
                                                                                debug('add',name,ct,total);
                    }//set
              });
              
              Object.defineProperty(stack,'complete',{get:()=>{
              
                    ct++;
                                                                                debug('complete',name,ct,total);
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
                                                                                debug('build',mod2.name);
                                                                                
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
                                            let {nn,inst}   = rd.root(node);
                                            let name        = inst||nn;
                                            let mod3        = mod2.create({mod:mod2,name});
                                            let index       = nodes.length;
                                            let complete    = async({node:custom})=>{
                                            
                                                                    nodes.splice(index,1,{node,custom});
                                                                    mod3.stack.add;
                                                                    await build({root:custom,mod:mod3});
                                                                    resolve();
                                                                    
                                                              }//complete
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
              
                    var {url,inst,nn}   = loader.fn.url(root);
                    var {html,error}    = await loader.fetch(url);
                    if(error){
                                                                                console.error(error);
                          return {error};
                    }
                                                                                if(!html.trim)debugger;
                    html            = html.trim();
                    
                    
                    var div         = document.createElement('div');
                    div.setHTMLUnsafe(html);
                    var node        = div.firstElementChild;
                                                                                if(!node)debugger;
                                                                                
                    root.attachShadow({mode:'open'});
                    root.shadowRoot.append(...node.shadowRoot.childNodes);
                    root.append(...div.childNodes);
                    
                    var node        = root;
                    
                    root.__root     = root;
                    root.__node     = root;
                    root.__host     = root;
                    
                    root.__html     = html;
                    root.__root     = root;
                    root.__dom      = root;
                                                                                //mod.df && console.log(nn,version,root,node);
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
                                var js      = script.textContent;
                                var host    = node;
                                var dom     = root;
                                define({js,mod,mod2,inst,dom,host,nn});
                          }
                          
                    });
                    
                    return {node};
                    
              }//loader
              
              
              loader.libs   = function({root,nn,version}){
              
                    var url;
                    if(!version){
                          url           = `https://libs.ext-code.com/html/${nn}/${nn}.html`;
                    }else{
                          url           = `https://libs.ext-code.com/html/${nn}/${version}/${nn}-${version}.html`;
                    }
                    return {url};
                    
              }//libs
              
              
              loader.grp    = function({root,type,nn,version}){
                                                                                //console.log('loader.grp',nn,version);
                    var sub;
                    if(type.length>3){
                          sub   = type.slice(3);
                    }
                    
                    var int   = (str)=>(/^\d+$/.test(str));
                    var num   = 0;
                    if(int(sub)){
                          num   = Number(sub);
                    }
                    
                    var par   = loader.fn.par({num});
                    
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
              
              
              loader.parent   = function({root,nn,version}){//debugger;
              
                    var parent      = rd(root,'parent');
                    var par         = $.parent(root,parent);
                    //var pversion    = rd.version(par);
                    //var url         = rd(par,'url');
                    var {url}       = loader.fn.url(par);
                    
                    var parts       = url.split('/');
                    parts.pop();
                    var last        = parts.at(-1);
                    if(isver(last)){
                          parts.pop();
                    }
                    url   = parts.join('/')+'/';
                    
                    /*
                    var num       = 1;
                    if(pversion){
                          num   = 2;
                    }
                    url           = slashes(url,num);
                    */
                    
                    
                    var src;
                    if(version){
                          src     = `html/${nn}/${version}/${nn}-${version}.html`;
                    }else{
                          src     = `html/${nn}/${nn}.html`;
                    }
                    
                    url          += src;
                    
                    return {url};
                    
              }//parent
              
              
              loader.page   = function({root,nn,version}){
              
                    var par   = loader.fn.par();
                    
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
                                html      = cache[url].html;
                          }else{
                                ({html}   = await cache[url].promise);
                          }
                    }else{
                                                                                //console.log('component.cache',url);
                          cache[url]            = {};
                          cache[url].promise    = new Promise(res=>cache[url].resolve=res);
                          
                          var res   = await fetch(url);
                          html      = await res.text();
                          
                          cache[url].html   = html;
                          cache[url].resolve({html});
                    }
                                                                                //console.log(Object.keys(cache));
                    return {html};
                    
              }//fetch
              
              
              loader.fn   = {};
              
              
              loader.fn.url   = function(root){
              
                    var {nn,inst}   =  rd.root(root);
                                                                                //console.log(nn,inst);
                    var type      = rd(root,'component');
                    if(!type){
                          type    = rd(root,'component_');
                    }
                    type    ||= 'libs';
                    
                    if(root.hasAttribute('component')){
                          var attr    = root.getAttribute('component');
                          root.removeAttribute('component');
                          if(attr){
                                root.setAttribute('component_',attr);
                          }else{
                                root.toggleAttribute('component_',true);
                          }
                    }
                    
                    var version   = rd.version(root);
                    
                    var url;
                    
                    switch(type){
                    
                      case 'libs'       : ({url}   = loader.libs({root,nn,version}));          break;
                      //case 'grp'        : ({url}   = loader.grp({root,nn,version}));           break;
                      case 'parent'     : ({url}   = loader.parent({root,nn,version}));        break;
                      case 'page'       : ({url}   = loader.page({root,nn,version}));          break;
                      
                    }//switch
                    
                    if(type.startsWith('grp')){
                          ({url}    = loader.grp({root,type,nn,version}));
                    }
                                                                                if(!url)debugger;
                    return {url,inst,nn};
                    
              }//url
              
              
              loader.fn.par   = function({num=0,df=false}={}){
              
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
                                                                                
                    for(var i=0;i<num;i++){
                    
                          par  += '../';
                          
                    }//for
                    
                    
                    var last    = dirs.at(-1);
                                                                                df && console.log('last',last);
                    if(isver(last)){
                          par  += '../';
                    }
                    
                    /*
                    if(last[0]=='v'){
                          var l   = last[1];
                          if(l>='0' && l<='9'){
                                par  += '../';
                          }
                    }
                    */
                    
                    return par;
                    
              }//par
              
              
              function isver(str){
              
                    if(str[0]=='v'){
                          var c   = str[1];
                          if(c>='0' && c<='9'){
                                return true;
                          }
                    }
                    return false;
                    
              }//isver
              
              
  //:
  
  
              function define({js,mod,mod2,inst,dom,host,nn}){
              
                    js    = `
                          //(()=>{return
                          
                                ${js}
                                
                          //})();
                    `;
                    
                    var fn        = eval(js);
                                                                                if(typeof fn!='function')debugger;
                    var obj;
                    var args      = sig(fn);
                                                                                console.log(args);
                    switch(args){
                    
                      //case '({mod,host})'   :
                      
                      default               : obj   = fn({mod:mod2,dom,host,   root:dom,node:host});
                      
                    }//switch
                    
                    var name      = nn;
                    if(inst){
                          name   += `[${inst}]`;
                    }
                    
                    
                    var key   = inst||name;
                    key       = suffix(key);
                    
                    mod[key]      = obj;
                    mod[inst]     = obj;
                    
                    
                    mod.list.push(key);
                    
                    
                    function suffix(key){
                                                                                //console.log(mod.name);
                          var max   = null;
                          
                          mod.list.forEach(name=>{
                          
                                var f   = false;
                                if(name===key)f   = true;
                                if(name.startsWith(key)){
                                      var t   = name.slice(key.length);
                                      if(t.match(/^\(\d+\)$/)){
                                            f   = true;
                                      }
                                }
                                
                                if(f){
                                      if(max===null){
                                            max   = 0;
                                      }
                                      var match   = name.match(/\((\d+)\)$/);
                                      if(match){
                                            var num   = parseInt(match[1],10);
                                            if(num>max){
                                                  max   = num;
                                            }
                                      }
                                }
                                
                          });
                          
                          if(max!==null){
                                key  += `(${max+1})`;
                          }
                          return key;
                          
                    }//suffix
                    
              }//define
              
              
              function sig(fn){
              
                    var str   = fn.toString();
                    var i1    = str.indexOf('(');
                    var i2    = str.indexOf(')');
                    var sig   = str.slice(i1,i2+1);
                    return sig;
                    
              }//sig
              
              
              
              
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
              
/*
              async function auto(initmod){
              
                    mod.list.forEach(name=>initmod[name]=mod[name]);
                    mod.list.forEach(name=>mod[name].initmod(initmod));
                    
                    var list    = mod.list.map(async name=>await mod[name].init());
                    await Promise.all(list);
                    
                    mod.list.forEach(name=>mod[name].initdom());
                    
              }//auto
*/



              async function auto(...args){
                                                                                debug('auto');
                    if(args.length==0){
                          args    = mod.list;
                    }
                    
                    var params    = Object.assign({},mod_root.base,mod.base);
                    
                    await Promise.all(
                          args.map(async(arg,i)=>{
                          
                                var fn;
                                if(typeof arg=='string'){
                                      fn    = mod[arg];
                                }else{
                                      fn    = arg;
                                }
                                                                                debug(i,fn);
                                                                                if(!fn)debugger;
                                                                                if(!fn.initmod)debugger;
                                fn.initmod(params);
                                await fn.init();
                                await fn.initdom();
                                
                          })
                    );
                    
              }//auto
              
              
              
              function rdparams(params,name,value,def){
              
                    if(name in params){
                          var value2    = params[name];
                          if(def){
                                value2   ??= def;
                          }
                          return value2;
                    }
                    return value;
                    
              }//rdparans
              
              
              function rdconfig(dom){
              
                    var node    = $(dom,'config')[0];
                    if(node){
                          node.remove();
                    }
                    node      = parseconfig(node);
                    if(node.error){
                          return {};
                    }
                    return node.config;
                    
              }//config
              
              
              function parseconfig(txt){
              
                    if(!txt){
                          return {config:{}};
                    }
                    
                    if(typeof txt!='string'){
                          var node    = txt;
                          txt         = node.textContent;
                    }
                                                                                //  remove // comments
                    txt   = txt.replace(/\/\/.*$/gm,'');
                                                                                //  remove /* */ comments
                    txt   = txt.replace(/\/\*[\s\S]*?\*\//g,'');
                    
                                                                                //  trailing commas
                    txt   = txt.replace(/,\s*([}\]])/g,'$1');
                                                                                //  double quote strings
                    txt   = txt.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g,'"$1"');
                                                                                //  quote keys
                    txt   = txt.replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g,'$1"$2":');
                                                                                console.log(txt);
                    if(!txt){
                          return {config:{}};
                    }
                    
                    var err;
                    try{
                    
                          var config    = JSON.parse(txt);
                          
                    }//try
                    catch(err2){
                    
                          err           = err2;
                          
                    }//catch
                    if(err){
                                                                                console.log(err);
                          var error     = err.toString();
                          return {config:{},error};
                    }
                    
                    return {config};
                    
              }//parseparams
              
              
              function rdattr(node,attr,config={}){
              
                    var def   = config[attr]||{};
                    
                    if(!node.hasAttribute(attr)){
                          return def;
                    }
                    
                    var config2   = def;
                    
                    var str       = node.getAttribute(attr);
                    var parts     = str.split(';');
                    parts.forEach(str=>{
                    
                          str   = str.trim();
                          if(str.indexOf('=')==-1){
                                config2[str]        = true;
                          }else{
                                var [name,value]    = str.split('=');
                                config2[name]       = value;
                          }
                          
                    });
                    return config2;
                    
              }//parseattr
              
              
              //function datatype(v){return Object.prototype.toString.call(v).slice(8,-1).toLowerCase()}
              
              
  //:
  
  
              function debug(...args){
              
                    if(!mod.df)return;
                    args.unshift(`[ mod.${name} ]`);
                    console.groupCollapsed.apply(console,args);
                    console.trace();
                    console.groupEnd();
                    
              }//debug
              
              
              
              
          return mod;
          
        }//create
        
        
        
        
  //init-hdr:
  
        var script    = document.currentScript;
                                                                                console.log(script.src);
        var url       = new window.URL(script.src);
        var params    = new URLSearchParams(url.search);
        if(!params.has('init')){
                                                                                console.log('exit');
              return;
        }
                                                                                console.clear();
                                                                                console.log('[ init-hdr ]');
                                                                                console.log();
                                                                                console.json=v=>console.log(JSON.stringify(v,null,4));
        var version='v1.0';
        
        df=false,did='';
        
        if(typeof ace=='undefined'){
              ace=null;
        }
        if(typeof log=='undefined'){
              log=null;
        }
        
        //Object.assign(window,{ext,$,datatype,menumod,keydown,debug,ls});
        
        menu=null;
        
        
    //:
    
    
        init_hdr    = async function(){
                                                                                debug('init_hdr',version);
                                                                                
              keydown.initdom();
              menu      = menumod();
              menu.initmod({keydown});
              menu.add.style();
              
              
              mod.base.add({
                    ext,$,datatype,keydown,menu,menumod,ls,
                    ace,log
              });
              
              
              if(typeof init!='function'){
                                                                                debug('auto');
                    await mod.auto();
                    setTimeout(complete,50);
                    
              }
              
              
              function complete(){
              
                    switch('function'){
                    
                      case typeof mod.onReady   : mod.onReady();        break;
                      case typeof mod.onready   : mod.onready();        break;
                      case typeof mod.ready     : mod.ready();          break;
                      case typeof mod.start     : mod.start();          break;
                      
                      case typeof onReady       : onReady();            break;
                      case typeof onready       : onready();            break;
                      case typeof ready         : ready();              break;
                      case typeof start         : start();              break;
                      
                    }//switch
                    
              }//complete
              
        }//init_hdr
        
        
  //:
  
;
(async()=>{

        mod.stack.add;
        
        ({ext}    = await import('https://libs.ext-code.com/js/io/ext-loader/ext-loader.m.js'));
        
        var lsmod;
        
        var promise   = ext.load.libs(
              'js/dom/$.js.api',
              'js/core/datatype.js',
              'js/dom/menumod/menumod.js',
              'js/dom/keydown/keydown.js',
              'js/debug/debug.js',
              'js/core/ls-mod/ls-mod.js',
        );
        [$,datatype,menumod,keydown,debug,lsmod]   = await promise;
        
        ls    = lsmod();
        
        mod.stack.complete;
        
})()
;





})();







