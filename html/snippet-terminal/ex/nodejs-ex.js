        
        
        //  download-repo-dir.node.mjs
        
        import fs from 'fs';
        
        var owner   = 'javascript-2020';
        var repo    = 'stackoverflow';
        var branch  = 'main';
        var path    = '/auto-login/';
        
        //https://github.com/javascript-2020/stackoverflow/tree/main/auto-login
                                                                                console.log(owner,repo,branch);
        if(path[0]=='/')path    = path.slice(1);
        if(path && path.slice(-1)!='/')path  += '/';
                                                                                console.log(path);
        var file    = `${path.split('/').filter(Boolean).at(-1)||repo}/`;
        fs.mkdirSync(file);    
        var url     = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=true`;
        var json    = await fetch(url).then(res=>res.json());
        
        json.tree.forEach(async(item,i)=>{
        
              if(!item.path.startsWith(path))return;
                                                                                //console.log(item);
              var fn    = item.path.slice(path.length);
                                                                                console.log(fn,item.size);
              if(item.type=='tree'){
                    fs.mkdirSync(file+fn);
              }else{
                    var fh        = fs.createWriteStream(file+fn);
                    var stream    = new WritableStream({write:data=>fh.write(data)});
                    var url       = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${item.path}`;
                    fetch(url).then(res=>res.body.pipeTo(stream));
              }
              
        });

