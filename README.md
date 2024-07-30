# libs

various libraries for different languages




```

        fetch.import          = url=>fetch(url).then(res=>res.text().then(js=>Promise.resolve(eval(`(${js})`))));
        fetch.import.gitraw   = url=>fetch.import('https://raw.githubusercontent.com/'+url);

```



