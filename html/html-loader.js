


/*

//github:libs/html/html-loader.js:d

10-02-25

*/


(async()=>{

        var nodename;
        /* params */

                
        var add         = ()=>(typeof init!='undefined' && init?.stack && init.stack.add);
        var complete    = ()=>(typeof init!='undefined' && init?.stack && init.stack.complete);
        
        add();



        var root;
        var nn;
        if(nodename){
              root          = $(nodename);
              if(root.nodeName=='SCRIPT'){
                    root    = root.parentNode;
              }
        }else{
              var script    = document.currentScript;
              root          = script.parentNode;
        }
        var nn    = root.nodeName.toLowerCase();

        
        var mode      = 'raw';
        var type      = 'libs';

        if(nn.endsWith('-debug')){
              nn      = nn.slice(0,-9);
              debugger;
        }
        if(nn.endsWith('-api')){
              nn      = nn.slice(0,-4);
              mode    = 'api';
        }
        
        if(nn.endsWith('-local')){
              nn      = nn.slice(0,-6);
              type    = 'local';
        }
        if(nn.endsWith('-utils')){
              nn      = nn.slice(0,-6);
              type    = 'utils';
        }
        
        
        var user      = 'javascript-2020';
        var repo      = 'libs';
        var path      = `html/${nn}/${nn}.html`;

        if(type=='local'){
              get_params();
        }
        if(type=='utils'){
              get_params_utils(nn);
        }
                                                      console.log(path);

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
        
        slots.forEach(slot=>node.append(slot));
        
        root.parentNode.replaceChild(node,root);

        
        var list              = $('script',node,true);
        [...list].forEach(script=>{
        
              var nscript                 = document.createElement('script');
              if(script.src){
                                                                                //console.log(script.src);
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
                                                                                //console.log(script.id);
                    nscript.textContent   = script.textContent;
              }
              script.parentNode.replaceChild(nscript,script);
              
        });


        complete();
        

        function gen(){
        
              var id    = (Math.random()+'').slice(2);
              return id;
              
        }//gen
        
        
        function get_params(){
        
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
        
        
        function get_params_utils(nn){
        
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

                      
        function $(nodename,par,all){
        
              var list      = par ? [par] : [document.head,document.body];
              var result    = [];
              
              while(list.length){
              
                    var node    = list.shift();
                    
                    if(node){
                          var f   = false;
                          
                          if(node.matches(nondename)){
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
