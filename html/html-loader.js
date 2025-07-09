
                

/*

//github:libs/html/html-loader.js:d

10-02-25
30-04-25    version 2
16-06-25    version 3

*/
                                                                        console.log('html-loader-v3.0');
                                                                        console.log();
(async()=>{
//debugger;

        var df    = false;
        
        var nodename;
        /* params */

                
        var add         = ()=>(typeof init!='undefined' && init?.stack && init.stack.add);
        var complete    = ()=>(typeof init!='undefined' && init?.stack && init.stack.complete);
        
        add();



        var root;
        var nn;
        if(nodename){
                                                                                df && console.log(nodename);
              root          = $(nodename);
              if(root.nodeName=='SCRIPT'){
                    root    = root.parentNode;
              }
        }else{
                                                                                df && console.log('cur-script');
              var script    = document.currentScript;
              root          = script.parentNode;
        }
        
        var nn    = root.nodeName.toLowerCase();
                                                                                df && console.log(root,nn);

        function rd(name,def){
        
              if(!root.hasAttribute('data-attr')){
                    return def;
              }
              var attr    = root.getAttribute('data-attr');
              var i1      = attr.indexOf('type=');
              if(i1==-1){
                    return def;
              }
              i1         += name.length;
              var i2      = attr.indexOf(' ',i1);
              var value   = attr.slice(i1,12);
              return value;            
                    
        }//rd


        if(rd('debug') || root.hasAttribute('data-debug')){
              debugger;
        }


        var user      = 'javascript-2020';
        var repo      = 'libs';
        var type      = 'libs';
        var mode      = 'raw';

        
        type          = rd('type',type);
        
                    
                    
        if(root.hasAttribute('data-type')){
              type    = root.getAttribute('data-type');
        }
        if(root.hasAttribute('data-api')){
              mode    = 'api';
        }
        if(root.hasAttribute('api')){
              mode    = 'api';
        }
        
        if(root.hasAttribute('github')){
              type    = 'github';
              path    = root.getAttribute('github');
              path   += `html/${nn}/${nn}.html`;
        }


        if(nn.endsWith('-debug')){
              nn      = nn.slice(0,-9);
              debugger;
        }


        if(nn.endsWith('-api')){
              nn      = nn.slice(0,-4);
              mode    = 'api';
        }

        
        if(nn.endsWith('-grp')){
              nn      = nn.slice(0,-4);
              type    = 'grp';
        }
        if(nn.endsWith('-page')){
              nn      = nn.slice(0,-5);
              type    = 'page';
        }
        if(nn.endsWith('-local')){
              nn      = nn.slice(0,-6);
              type    = 'page';
        }
        if(nn.endsWith('-utils')){
              nn      = nn.slice(0,-6);
              type    = 'utils';
        }

        
        var path      = `html/${nn}/${nn}.html`;
        var url;
        var txt;
                                                                                df && console.log(nn,type);
        switch(type){
          
          case 'page'     : get_params_page();          break;
          case 'grp'      : get_params_grp();           break;
          case 'github'   : get_params_github();        break;
          case 'utils'    : get_params_utils();         break;
          case 'parent'   : get_params_parent();        break;
          
        }//switch
                                                                                df && console.log(path);
        
        switch(mode){
          
          case 'api'    : ({url,txt}    = await api());           break;
          case 'raw'    : ({url,txt}    = await raw());           break;
          case 'url'    : ({url,txt}    = await get_url());       break;
          
        }//switch
                                                                                //console.log(txt);

        var loader_script   = root.querySelector('script');
        slots               = [...root.childNodes];
        var i               = slots.indexOf(loader_script);
        slots.splice(i,1);
        
        txt                   = txt.trim();
        var div               = document.createElement('div');
        div.setHTMLUnsafe(txt);
        var node              = div.firstElementChild;
        if(!node)debugger;
        
        node.setAttribute('data-url',url);
        
        slots.forEach(slot=>node.append(slot));
        
        root.parentNode.replaceChild(node,root);
                                                                                console.log(node);
                                                                                df && console.log('added');
                                                                                //debugger;
        
        var list              = $('script',node,true);
        [...list].forEach(script=>{
        
              var nscript                 = document.createElement('script');
              if(script.src){
                                                                                df && console.log('script.src',script.src);
                    var src   = script.src;
                    if(script.hasAttribute('html-loader')){
                          var id    = gen();
                          nscript.setAttribute('html-loader',id);
                          src  += `?[html-loader=${id}]`;
                    }
                    nscript.src           = src;
                    nscript.onload        = complete;
                    add();
              }else{
                                                                                df && console.log('script.id',script.id);
                                                                                //debugger;
                    nscript.textContent   = script.textContent;
              }
              script.parentNode.replaceChild(nscript,script);
              
        });


        complete();
        

        function gen(){
        
              var n     = Math.random();
              var s     = (n+'').slice(2);
              var id    = 'x'+s;
              return id;
              
        }//gen
        
        
        function get_params_page(){
        
              repo    = 'javascript-2020.github.io';
              path    = window.location.pathname;
                
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
              path    = path.slice(1);
              var i   = path.lastIndexOf('/');
              path    = path.slice(0,i+1);
              path   += `html/${nn}/${nn}.html`;

        }//get_params
        
        
        function get_params_grp(){
                                                                                df && console.log('get_params_grp',nn);
              repo    = 'javascript-2020.github.io';
              path    = window.location.pathname;
                                                                                df && console.log(path);
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
              path   += `html/${nn}/${nn}.html`;
              
                                                                                df && console.log(path);              
        }//get_params_grp
        
        
        function get_params_utils(){
        
              repo    = 'javascript-2020.github.io';
              path    = `utils/html/${nn}.html`;
              
        }//get_params_utils
        

        function get_params_parent(){
        
              var nn        = root.nodeName.toLowerCase();
              
              var parent    = root.getAttribute('data-parent');
              parent        = rd('parent',parent);
              
              var par       = $_parent(root,parent);
              
              var url       = par.getAttribute('data-url');
              url           = rd('url',url);
              
              var i         = url.lastIndexOf('/');
              url           = url.slice(0,i+1);
              
              var src       = root.getAttribute('data-src');
              src           = rd('src',src);
              src         ||= `html/${nn}/${nn}.html`;
              
              url          += src;
              
              parse_url(url);
              
        }//get_params_parent
        
        
  //:
  
  
        async function raw(){
                                                                                console.log('html-loader.raw');
                                                                                console.log(repo,path);
              var url               = `https://raw.githubusercontent.com/${user}/${repo}/main/${path}`;
                                                                                console.log(url);
              var err;
              try{
              
                    var res               = await fetch(url);
                    
              }
              catch(err2){
              
                    err   = err2;
                    
              }
              if(err){
                    alert('fetch error\n'+err.toString());
                    return;
              }
              
              var txt               = await res.text();
              return {url,txt};
              
        }//raw


        async function api(){
                                                                                console.log('html-loader.api');
                                                                                console.log(repo,path);
              var headers   = {accept:'application/vnd.github+json'};
              var token     = localStorage.getItem('github-token');
              if(token){
                    headers.authorization   = 'Bearer '+token;
              }
              var url       = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
                                                                                console.log(url);
              var err;
              try{
              
                    var res       = await fetch(url,{headers});
                    
              }
              catch(err2){
              
                    err   = err2;
                    
              }
              if(err || !res.ok){
                    var result    = raw();
                    return result;
              }
              
              var json      = await res.json();
              var b64       = json.content;
              
              try{
              
                    var txt       = window.atob(b64);
                    
              }
              catch(err){
                                                                                console.log('html-loader.api');
                                                                                console.log(nn,type,mode);
                                                                                console.log(repo,path);
                    throw err;
              }
              
              return {url,txt};
        
        }//api


        async function get_url(){
        }//get_url
        

  //:
  

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
                
        
        function $(nodename,par,all){
        
              var list      = par ? [par] : [document.head,document.body];
              var result    = [];
              
              while(list.length){
              
                    var node    = list.shift();
                    
                    if(node){
                          var f   = false;
                          
                          if(node.matches && node.matches(nodename)){
                                f   = true;
                          }
                          var nn    = node.nodeName.toLowerCase();                          
                          if(nn===nodename){
                                f   = true;
                          }
                          
                          if(nn.endsWith('-api')){
                                nn    = nn.slice(0,-4);
                          }
                          
                          if(nn===nodename){
                                f   = true;
                          }
                          
                          
                          if(f){
                                if(!all){
                                      return node;
                                }
                                result.push(node);
                          }
                          
                          if(node.shadowRoot){
                                list.push(node.shadowRoot);
                          }
                          if(node.childNodes){
                                [...node.childNodes].forEach(node=>list.push(node));
                          }
                    }
                    
              }//while
              
              if(!all){
                    return null;
              }
              
              return result;
              
        }//$
        
        
        function $_parent(node,parent){
        
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
        
        
        function parse_url(url){
        
              var parts   = new URL(url);
              var str;
              var i;
              
              if(parts.hostname=='api.github.com'){
                    str     = parts.pathname.split('/');
                    i       = parts.pathname.indexOf('/contents/');
                    i      += 10;
                    user    = str[2];
                    repo    = str[3];
                    path    = parts.pathname.slice(i);
              }
              
              if(parts.hostname=='rawgithubusercontent.com'){
                    str     = parts.pathname.split('/');
                    i       = parts.pathname.indexOf('/main/');
                    i      += 6;
                    user    = str[1];
                    repo    = str[2];
                    path    = parts.pathname.slice(i);
              }
              
        }//parse_url





        
})();

