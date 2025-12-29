# libs

various libraries for different languages


```

        ({ext}    = await import('https://libs.ext-code.com/js/io/ext-loader/ext-loader.m.js'));

```



```
                                                                                console.clear();
                                                                                console.json=v=>console.log(JSON.strinigify(v,null,4));
```




```

        function debug(...args){
          
              if(!df && !obj.df)return;
              args.unshift(`[ ${did} ]`);
              var fmt     = Array.from({length:args.length}).fill('%O').join(' '); 
              var args2   = [fmt].concat(args);
              console.groupCollapsed.apply(console,args2);
              console.trace();
              console.groupEnd();
              
        }//debug


```
