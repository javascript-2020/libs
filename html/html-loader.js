

(async()=>{

        (typeof init!='undefined' && init?.stack && init.stack.add);

    
        var script            = document.currentScript;
        var par               = script.parentNode;
        var nn                = par.nodeName.toLowerCase();

        
        var mode    = 'raw';
        var type    = 'libs';


        if(nn.endsWith('-api')){
              nn      = nn.slice(0,-4);
              mode    = 'api';
        }
        
        if(nn.endsWith('-local')){
              nn      = nn.slice(0,-6);
              type    = 'local';
        }
        
        
        var user      = 'javascript-2020';
        var repo      = 'libs';
        var path      = `html/${nn}/${nn}.html`;

        if(type=='local'){
              get_params();
        }
                                                      console.log(path);

        var txt;
        if(mode=='api'){
              txt   = await api();
        }else{
              txt   = await raw();
        }


        
        txt                   = txt.trim();
        var div               = document.createElement('div');
        div.setHTMLUnsafe(txt);
        var root              = div.firstElementChild;
        par.parentNode.replaceChild(root,par);
        
        var list              = root.getElementsByTagName('script');
        list.forEach(script=>{
        
              var nscript           = document.createElement('script');
              nscript.textContent   = script.textContent;
              script.parentNode.replaceChild(nscript,script);
              
        });


        (typeof init!='undefined' && init?.stack && init.stack.complete);


        function get_params(){
        
              repo    = 'javascript-2020.github.io';
              path    = window.location.pathname;
              
              if(path==='srcdoc'){
                    var base          = document.querySelector('base');
                    if(base){
                          var href    = base.href;
                          var url     = new URL(href);
                          path        = url.pathname;
                    }else{
                          path        = window.parent.location.pathname;
                    }
              }
              
              var i   = path.lastIndexOf('/');
              path    = path.slice(0,i+1);
              path   += `html/${nn}.html`;

        }//get_params
        
        
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
                      
    
})();

