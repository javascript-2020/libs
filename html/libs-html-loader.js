
(async()=>{
    
        var complete;
        if(typeof init!='undefined'){
            if(init.stack){
                init.stack.add;
            }
        }
    
        var script            = document.currentScript;
        var par               = script.parentNode;
        var nn                = par.nodeName.toLowerCase();
        
        var txt;
        var mode    = 'raw';
        
        if(nn.endsWith('-api')){
              nn      = nn.slice(-4);
              mode    = 'api';
        }
        
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
        var script            = root.getElementsByTagName('script')[0];
        var nscript           = document.createElement('script');
        nscript.textContent   = script.textContent;
        script.parentNode.replaceChild(nscript,script);

        if(init.stack){
            init.stack.complete;
        }
        
        
        async function raw(){
        
              var url               = `https://raw.githubusercontent.com/javascript-2020/libs/main/html/${nn}/${nn}.html`;
              var res               = await fetch(url);
              var txt               = await res.text();
              return txt;
              
        }//raw
        
        
        async function api(){

              var headers   = {accept:'application/vnd.github+json'};
              
              var token     = localStorage.getItem('github-token');console.log(token);
              if(token){
                    headers.authorization   = 'Bearer '+token;
              }
              
              var user      = 'javascript-2020';
              var repo      = 'libs';
              var path      = 'html/github/github.html';
              
              var url       = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
              var res       = await fetch(url,{headers});
              var json      = await res.json();
              var b64       = json.content;
              var txt       = window.atob(b64);
              return txt;
        
        }//api
    
})();

