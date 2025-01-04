
(async()=>{
    
        var complete;
        if(typeof init!='undefined'){
            if(init.stack){
                complete  = init.stack.add();
            }
        }
    
        var script            = document.currentScript;
        var par               = script.parentNode;
        var nn                = par.nodeName.toLowerCase();
        
        var txt;
        var mode    = 'raw';
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

        if(complete){
            complete();
        }
        
        
        async function raw(){
        
              var url               = `https://raw.githubusercontent.com/javascript-2020/libs/main/html/${nn}/${nn}.html`;
              var res               = await fetch(url);
              var txt               = await res.text();
              return txt;
              
        }//raw
        
        
        function api(){
        }//api
    
})();

