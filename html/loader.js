  (async()=>{
    var script=document.currentScript;
    var par=script.parentNode;
    var url='https://raw.githubusercontent.com/javascript-2020/libs/main/html/';
    var src=par.getAttrbiute('src');
    url+=src;
    var res=await fetch(url);
    var txt=await res.text();
    txt=txt.trim();
    var div=document.createElement('div');
    div.setHTMLUnsafe(txt);
    var root=div.firstElementChild;
    par.parentNode.replaceChild(root,par);
    var script=root.getElementsByTagName('script')[0];
    var nscript=document.createElement('script');
    nscript.textContent=script.textContent;
    script.parentNode.replaceChild(nscript,script);
    
  })();
