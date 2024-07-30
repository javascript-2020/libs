# libs

various libraries for different languages




```

        fetch.import          = url=>fetch(url).then(res=>res.text().then(js=>Promise.resolve(eval(`(${js})`))));
        fetch.import.gitraw   = url=>fetch.import('https://raw.githubusercontent.com/'+url);
        fetch.import.me       = url=>{var i=url.indexOf('/'),repo=url.slice(0,i),path=url.slice(i+1);
                                      return fetch.import.gitraw(`javascript-2020/${repo}/main/${path}`)};

```



