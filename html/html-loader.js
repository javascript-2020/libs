
                

/*

//github:libs/html/html-loader.js:d

10-02-25
30-04-25        version 2

*/
                                                                        console.log('html-loader-v2.0');
                                                                        console.log();
(async()=>{
//debugger;

        var df    = true;
        
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

        if(root.hasAttribute('data-debug')){
              debugger;
        }

        
        var user      = 'javascript-2020';
        var repo      = 'libs';
        var type      = 'libs';
        var mode      = 'raw';


        if(nn.endsWith('-debug')){
              nn      = nn.slice(0,-9);
              debugger;
        }

        if(root.hasAttribute('github')){
              type    = 'github';
              path    = root.getAttribute('github');
              path   += `html/${nn}/${nn}.html`;
        }
        
        if(nn.endsWith('-api')){
              nn      = nn.slice(0,-4);
              mode    = 'api';
        }
        
        if(nn.endsWith('-grp')){
              nn      = nn.slice(0,-4);
              mode    = 'grp';
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
                                                                                df && console.log(nn,type);
        switch(type){
          
          case 'page'     : get_params_page();          break;
          case 'grp'      : get_params_grp();           break;
          case 'github'   : get_params_github();        break;
          case 'utils'    : get_params_utils();         break;
          
        }//switch
                                                                                df && console.log(path);

        var txt;
        if(mode=='api'){
              txt   = await api();
        }else{
              txt   = await raw();
        }
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
        
        slots.forEach(slot=>node.append(slot));
        
        root.parentNode.replaceChild(node,root);
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
              
              var i   = path.lastIndexOf('/');
              path    = path.slice(0,i+1);
              path   += `html/${nn}/${nn}.html`;

        }//get_params
        
        
        function get_params_grp(){
                                                                                console.log('get_params_grp');
              repo    = 'javascript-2020.github.io';
              path    = window.location.pathname;
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
              path    = get_slash(path,2);
                                                                                console.log(path);              
        }//get_params_grp
        
        
        function get_params_utils(){
        
              repo    = 'javascript-2020.github.io';
              path    = `utils/html/${nn}.html`;
              
        }//get_params_utils
        

        
        async function raw(){
        
              var url               = `https://raw.githubusercontent.com/${user}/${repo}/main/${path}`;
              var res               = await fetch(url);
              var txt               = await res.text();
              return txt;
              
        }//raw


        async function api(){

              var headers   = {accept:'application/vnd.github+json'};
              var token     = localStorage.getItem('github-token');
              if(token){
                    headers.authorization   = 'Bearer '+token;
              }
              var url       = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
              var res       = await fetch(url,{headers});
              var json      = await res.json();
              var b64       = json.content;
              var txt       = window.atob(b64);
              return txt;
        
        }//api


        function getslash(path,num){
        
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

        
})();

