


```

<log-root>
  <script>
  (async()=>{
  console.clear();
  
    var script=document.currentScript;
    var res=await fetch('https://raw.githubusercontent.com/javascript-2020/libs/main/html/log.html');
    var txt=await res.text();
    txt=txt.trim();
    var div=document.createElement('div');
    div.setHTMLUnsafe(txt);
    var root=div.firstElementChild;
    var par=script.parentNode;
    par.parentNode.replaceChild(root,par);
    var script=root.getElementsByTagName('script')[0];
    var nscript=document.createElement('script');
    nscript.textContent=script.textContent;
    script.parentNode.replaceChild(nscript,script);
    
  })();
  </script>
</log-root>

<button onclick="window.log.green('test')">test</button>

```
