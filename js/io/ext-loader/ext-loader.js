

/*


var url   = `https://api.github.com/repos/javascript-2020/ext-code/contents/loader.js`,
    opts  = {headers:{accept:'application/vnd.github.raw+json'}};
(await fetch(url,opts).then(res=>res.text()).then(eval))();



(await fetch(`https://api.github.com/repos/javascript-2020/ext-code/contents/loader.js`,{headers:{accept:'application/vnd.github.raw+json'}}).then(res=>res.text()).then(eval))();



(await fetch('https://raw.githubusercontent.com/javascript-2020/ext-code/main/loader.js').then(res=>res.text().then(eval)))();

(await fetch('https://raw.githubusercontent.com/javascript-2020/ext-code/main/loader.js').then(res=>res.text().then(eval)))(window,'ext');

var ext   = (await fetch('https://raw.githubusercontent.com/javascript-2020/ext-code/main/loader.js').then(res=>res.text().then(eval)))(null);

( (typeof ext=='undefined') &&
  (ext=(await fetch('https://raw.githubusercontent.com/javascript-2020/ext-code/main/loader.js').then(res=>res.text().then(eval)))(null))
);

var loader    = await fetch('https://raw.githubusercontent.com/javascript-2020/ext-code/main/loader.js').then(res=>res.text().then(eval));
loader();
loader(window);
loader(window,'test');




(await new Promise(resolve=>{
      var loader    = 'https://raw.githubusercontent.com/javascript-2020/ext-code/main/loader.js',body='';
      require('https').get(loader,async res=>{for await(data of res)body+=data;resolve(eval(body))}).end();
}))();


  fs
  --
  
eval(require('fs').readFileSync(require('base').root+'projects/ext-code/loader.js','utf8'))();



            <scr  ipt ext>

(async()=>{
  
        init.stack.add;
        
        var token   = localStorage['github-token'];
        var url;
        var headers;
        if(token){
              url       = 'https://api.github.com/repos/javascript-2020/ext-code/contents/ext-loader.js';
              headers   = {accept:'application/vnd.github.raw',authorization:`bearer ${token}`};
        }else{
              url       = 'https://raw.githubusercontent.com/javascript-2020/ext-code/main/ext-loader.js';
        }
        
        //fetch(url,headers).then(res=>res.text()).then(ext);
        await fetch(url,{headers}).then(res=>res.text()).then(complete);

            
        async function complete(txt){

              ext           = eval(txt);
              var promise   = ext.load.libs(
                    'js/dom/$.js.api',
                    'js/core/datatype.js',
                    'js/dom/menumod/menumod.js',
                    'js/dom/keydown/keydown.js',
                    'js/crypto/encrypt/encrypt.js.api'
              );
              [$,datatype,menumod,keydown,encrypt]   = await promise;

              init.stack.complete;

        }//ext_fn

})();
            </scr  ipt ext>




*/



//var loader    =

var ext;

(()=>{

  ext                       = {};
  ext[Symbol.toStringTag]   = 'ext-code';
                                                                                //console.clear();
                                                                                //console.log('ext-code.loader-v1.1');
                                                                                //console.log();
        
        ext.load          = {};
        ext.text          = {};
        ext.create        = {};
        ext.import        = importfn;
        
        create();
        local();
        github();
        
        
        ext.create.repo('code','javascript-2020','ext-code','main');
        ext.create.repo('libs','javascript-2020','libs','main','');
        ext.create.repo('nodejs','javascript-2020','code-projects','main','node-js/');
        
        
        //snippets();

        
        var dbmod
        ;
        
        load_libs         = load_libs();
        
        
        
        
        function is(v){
        
              var str       = Object.prototype.toString.call(v);
              str           = str.slice(8,-1);
              var result    = (str==ext[Symbol.toStringTag]);
              return result;
              
        }//is
        
        
        function create(){
        
              ext.create.repo   = function(name,owner,repo,branch,def_dir){
                                                                                ext.df && console.log('create',type);
                    var list    = {};
                    
                    
                    function simple(args){
                      
                          if(name!=='libs'){
                                return args;
                          }
                          
                          var n   = args.length;
                          for(var i=0;i<n;i++){
                            
                                var fn    = args[i];
                                var fn2;
                                
                                switch(fn){
                                  
                                  case '$'          : fn2   = 'js/dom/$.js.api';            break;
                                  case 'datatype'   : fn2   = 'js/core/datatype.js';        break;
                                  case 'debug'      : fn2   = 'js/debug/debug.js';          break;
                                  
                                }//switch
                                
                                if(fn2){
                                      args.splice(i,1,fn2);
                                }
                                
                          }//for
                          
                          return args;
                          
                    }//simple
                    
                    
                    var load    = {};
                    
                    load.get    = async function(target,prop,text){
                                                                                ext.df && console.log(`load.${name}`,prop);
                          
                          var lname   = prop.split('/');
                          var key     = modproxy.key(lname);
                          
                          if(list[key]){
                                return list[key];
                          }
                          var txt   = await load.text(prop,lname);
                                                                                if(ext.df)debugger;
                          var value;
                          if(text){
                                value   = txt;
                          }else{
                                value   = define(txt);
                          }
                                                                                ext.df && console.log(`load.${name}`,prop,typeof value);
                          ext[name][key]    = value;
                          return value;
                          
                    }//get
                    
                    load.apply    = function(target,thisArg,args,text){
                    
                          args    = simple(args);
                          return Promise.all(args.map(arg=>load.get(target,arg,text)));
                          
                    }//apply
                    
                    ext.load[name]    = new Proxy(()=>{},{
                          get     : (target,prop)=>load.get(target,prop),
                          apply   : (target,thisArg,args)=>load.apply(target,thisArg,args)
                    });
                    
                    ext.text[name]    = new Proxy(()=>{},{
                          get   : (target,prop)=>load.get(target,prop,'text'),
                          apply : (target,thisArg,args)=>load.apply(target,thisArg,args,'text')
                    });
                    
                    
                    ext[name]   = modproxy(list,notfound);

                    
                    async function notfound(lname,args){
                                                                                ext.df && console.log('notfound',lname);
                          var file          = lname.join('/');
                          var txt           = await load.text(file,lname);
                          
                          var value         = define(txt);
                          
                          var key           = modproxy.key(lname);
                          ext[name][key]    = value;
                          
                          if(typeof value!='function'){
                                return value;
                          }
                          
                          var fn        = value;
                          var result    = await fn.apply(null,args);
                          return result;
                          
                    }//notfound
                    
                    
                    load.text   = async function(file,lname){
                                                                                ext.df && console.log('load',lname);
                          if(def_dir){
                                file    = def_dir+file;
                          }
                          
                          var mode    = 'raw';
                          if(file.endsWith('.api')){
                                file    = file.slice(0,-4);
                                mode    = 'api';
                          }
                          
                          var token;
                          if(typeof localStorage!='undefined'){
                                token   = localStorage['github-token'];
                          }
                          if(token){
                                mode    = 'api';
                          }

                          var {txt,error}   = await loader({mode,token,owner,repo,branch,file});
                          if(error){
                                                                                console.log('failed to load remote-function: '+file);
                                                                                console.log(error);
                                return '[ not found '+file+' ]';
                          }

                          return txt;

                    }//load
                    
              }//create.repo
              
        }//create
        
        
        function snippets(){
        }//snippets
        
        
        function github(){
        
              var list    = {};
              
              var load    = {};
              var cur;
              var proxy   = {};

              
              load.get    = async function(target,prop,text){
                                                                                  ext.df && console.log('load.proxy',prop);
                    if(list[prop]){
                          return list[prop];
                    }
                    
                    var txt   = await load.text(prop,text);
                    
                    var value;
                    if(text){
                          value   = txt;
                    }else{
                          value   = define(txt);
                    }
                    
                    list[prop]    = value;
                    return value;
                    
              }//get

              
              load.apply    = function(target,thisArg,args,text){
              
                    return Promise.all(args.map(arg=>load.get(target,arg,text)));
                    
              }//apply

              
              ext.load.github   = new Proxy(()=>{},{get:load.get,apply:load.apply});

              
              ext.text.github   = new Proxy(()=>{},{
                    get   : (target,prop)=>load.get(target,prop,'text'),
                    apply : (target,thisArg,args)=>load.apply(target,thisArg,args,'text')
              });
              
              
              proxy.get   = async function(target,prop){
              
                    cur   = prop;
                    if(list[prop]){
                          return list[prop];
                    }
                    
                    var txt       = await load.text(prop);
                    
                    var value     = define(txt);
                    list[prop]    = value;
                    return value;
                    
              }//get2

              
              proxy.apply   = async function(target,thisArg,args){
              
                    var value   = list[cur];
                    
                    if(typeof value!='function'){
                          return value;
                    }
                    
                    var fn        = value;
                    var result    = await fn.apply(thisArg,args);
                    return result;
                    
              }//apply2

              
              ext.github    = new Proxy({},{get:proxy.get,apply:proxy.apply});


              

              
              load.text   = async function(prop){
              
                    var {owner,repo,branch,file}    = parse(prop);

                    
                    var token;
                    var mode    = 'raw';
                    if(typeof localStorage!='undefined'){
                          token   = localStorage['github-token'];
                    }
                    if(token){
                          mode    = 'api';
                    }
                      
                    var {txt,error}   = await loader({mode,token,owner,repo,branch,file});
                    if(error){                                                                                
                                                                                console.log('failed to load remote-function: '+file);
                                                                                console.log(error);
                          return '[ not found '+file+' ]';
                    }

                    return txt;

              }//load

              
              function parse(prop){
              
                    var parts     = prop.split(':');
                    
                    var owner     = parts[0];
                    var repo      = parts[1];
                    var branch    = parts.length==4 ? parts[2] : null;
                    var file      = parts.at(-1);
                    
                    return {owner,repo,branch,file};
                    
              }//parse
              
        }//github
        
        
        function local(){
        
              var list    = {};
              
              var load    = {};
              var cur;
              var proxy   = {};
              
              
              load.get    = function(target,prop,text){
                                                                                  ext.df && console.log('load.local',prop);
                    if(list[prop]){
                          return list[prop];
                    }
                    
                    var txt     = load.text(prop);
                    
                    var value;
                    if(text){
                          value   = txt;
                    }else{
                          value   = define(txt);
                    }
                    
                    list[prop]    = value;
                    return value;
                    
              }//get

              
              load.apply    = function(target,thisArg,args,text){
              
                    return args.map(arg=>load.get(target,arg,text));
                    
              }//apply

              
              ext.load.local    = new Proxy(()=>{},{get:load.get,apply:load.apply});

              
              ext.text.local    = new Proxy(()=>{},{
                    get     : (target,prop)=>load.get(target,prop,'text'),
                    apply   : (target,thisArg,args)=>load.apply(target,thisArg,args,'text')
              });
              
              
              proxy.get   = function(target,prop){
              
                    cur   = prop;
                    if(list[prop]){
                          return list[prop];
                    }
                    
                    var txt     = load.text(prop);
                    
                    var value   = define(txt);
                    list[prop]  = value;
                    return value;
                    
              }//get

              
              proxy.apply   = function(target,thisArg,args){
              
                    var value   = list[cur];
                    
                    if(typeof value!='function'){
                          return value;
                    }
                    
                    var fn        = value;
                    var result    = fn.apply(thisArg,args);
                    return result;
                    
              }//apply

              
              ext.local    = new Proxy({},{get:proxy.get,apply:proxy.apply});
              
              
              load.text   = function(file){
                                                                                ext.df && console.log('local.load',file);
                    var txt     = fs.readFileSync(file,'utf8');
                    return txt;
                    
              }//load
              
        }//local

        
  //:


        async function loader({mode,token,owner,repo,branch,file}){
          
              if(!token){
                    if(typeof localStorage!='undefined'){
                          token   = localStorage['github-token'];
                    }
              }
              
              var {txt,error}   = await loader[mode]({token,owner,repo,branch,file});
              if(error && mode=='api'){
                    ({txt,error}   = await loader.raw({token,owner,repo,branch,file}));
              }
              return {txt,error};
              
        }//loader
        

        loader.fetch    = async function(url,opts){
          
              var err;
              try{
                
                    var res   = await fetch(url,opts);
                    
              }//try
              catch(err2){
                
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = err.toString();
                    return {error};
              }
              
              if(!res.ok){
                    var error   = await res.text();
                    return {error};
              }
              
              var txt   = await res.text();
              
              if(res.headers.get('content-type').includes('json')){
                    var err;
                    try{
                      
                          var json    = JSON.parse(txt);
                          var b64     = json.content;
                          var txt2    = atob(b64);
                          txt         = txt2;
                          
                    }//try
                    catch(err2){
                      
                          err   = err2;
                    }
              }
              
              return {txt};
              
        }//fetch
        
        
        loader.raw    = async function({owner,repo,branch,file}){
          
              branch            ||= 'main';
              var url             = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file}`;
              var {txt,error}     = await loader.fetch(url);
              return {txt,error};
              
        }//raw

        
        loader.api    = async function({token,owner,repo,branch,file}){
          
              var url     = `https://api.github.com/repos/${owner}/${repo}/contents/${file}`;
              if(branch){
                    url  += `?ref=${branch}`;
              }
              
              var opts    = {headers:{accept:'application/vnd.github.raw'}};
            
              if(!token){
                    if(typeof localStorage!='undefined'){
                          token    = localStorage['github-token'];
                    }
              }
              if(token){
                    opts.headers.authorization    = `bearer ${token}`;
              }
          
              var {txt,error}   = await loader.fetch(url,opts);
              return {txt,error};
              
        }//api
  
  
  //:
  
  
        function define(fnstr){
                                                                                  ext.df && console.log('define',fnstr);
              var code    = `
                    (()=>{
                    
                          var fn    = ${fnstr};
                          return fn;
                          
                    })();
              `;

              var fn    = window.eval(code);
                                                                                  ext.df && console.log('define',fn);
              return fn;
              
        }//define

        
  //:

  
        function modproxy(mem,notfound,opts={}){
        
              modproxy.key    = lname=>lname.join(',');
              
              return newproxy();
              
              
              function getter(target,name,receiver,lname){
              
                    lname   = structuredClone(lname);
                    lname.push(name);
                    var key   = modproxy.key(lname);
                                                                                  //console.log(`rd : ${key}`);
                    if(key in mem){
                                                                                  //console.log('found');
                          return mem[key];
                    }
                    if(opts.promiseCompat){
                        if(lname=='then'){
                            return null;
                        }
                    }
                    return newproxy(()=>{},lname);
                    
              }//getter
              
              
              function setter(target,name,newval,lname){
              
                    lname   = structuredClone(lname);
                    lname.push(name);
                    var key   = modproxy.key(lname);
                                                                                  //console.log(`wt : ${key} - ${newval}`);
                    mem[key]    = newval;
                    return true;
                  
              }//setter
              
              
              function applyer(target,thisArg,args,lname){
              
                    var key   = modproxy.key(lname);
                    if(key in mem){
                          var v   = mem[key];
                          if(typeof v==='function'){
                                                                                  //console.log(`fn : ${lname} - [${args}]`);
                                return v.apply(thisArg,args);
                          }
                          return v;
                    }
                                                                                  //console.log(`fn (not found): ${lname} - [${args}]`);
                    return notfound(lname,args);
                    
              }//applyer
              
              
              function newproxy(target=()=>{},lname=[]){
              
                    var proxy   = new Proxy(target,{
                                        get:(target,name,receiver)=>getter(target,name,receiver,lname),
                                        set:(target,name,newval)=>setter(target,name,newval,lname),
                                        apply:(target,thisArg,args)=>applyer(target,thisArg,args,lname)
                                  });
                                  
                    return proxy;
                    
              }//newproxy
              
        }//modproxy


  //:
  
  
        async function importfn(){
        
              var args    = [...arguments];
              var n       = args.length;
              var mods    = new Array(n);
              await Promise.all(args.map(async(url,i)=>{
              
                    var type;
                    if(typeof url!='string'){
                          var o   = url;
                          type    = o.type;
                          url     = o.url;
                    }
                    if(url in urls){
                          url   = urls[url];
                    }
                    
                    var mod;
                    
                    mod   = await import(url);
                    
                    if(type=='default'){
                          mod   = mod.default;
                    }
                    mods[i]   = mod;
                    
              }));
              
              return mods;
              
        }//importfn
        
        
        
        var urls      = {};
        urls.rsa      = 'https://cdn.jsdelivr.net/npm/jsrsasign/+esm';
        urls.forge    = 'https://cdn.jsdelivr.net/npm/node-forge/+esm';


        
        function load_libs(){

              var resolve,promise   = new Promise(res=>resolve=res);
              
              setTimeout(fn,100);

              return promise;
              
              
              async function fn(){
              
                    var promise   = ext.load.libs('js/core/dbmod/single-value-dbmod.js');
                    [dbmod]       = await promise;
                    
              }//fn
              
        }//load_libs




        

  //:
  
  
  

  return ext;


        
})();








