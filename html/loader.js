
(async()=>{
    
        var script            = document.currentScript;
        var par               = script.parentNode;
        var nn                = par.nodeName.toLowerCase();
        var url               = `https://raw.githubusercontent.com/javascript-2020/libs/main/html/${nn}/${nn}.html`;
        var res               = await fetch(url);
        var txt               = await res.text();
        txt                   = txt.trim();
        var div               = document.createElement('div');
        div.setHTMLUnsafe(txt);
        var root              = div.firstElementChild;
        par.parentNode.replaceChild(root,par);
        var script            = root.getElementsByTagName('script')[0];
        var nscript           = document.createElement('script');
        nscript.textContent   = script.textContent;
        script.parentNode.replaceChild(nscript,script);
    
})();

