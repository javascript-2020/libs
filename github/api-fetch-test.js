


(async()=>{

        window.parent.coutput.replaceChildren();
        console.clear();
        
        
        var owner     = 'javascript-2020';
        var repo      = 'tmp';
        var branch    = 'main';
        var path      = 'myfile.js';

        
        var url       = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=true`;
        var json      = await fetch(url).then(res=>res.json()).catch(error);

        console.json(json);

        var item    = json.tree.find(o=>o.path===path);
        if(item){
              if(item.type=='blob'){
                    var i   = path.lastIndexOf('/');
                    if(i==-1){
                          path    = '';
                    }else{
                          path    = path.slice(0,i);
                    }
              }
        }else{
              if(path){
                    console.log('not found '+path);
                    return;
              }
        }
        
        if(path){
              if(path.slice(-1)!='/'){
                    path   += '/';
              }
        }
        
        console.log('path : ',path);
        
        
        function error(err){
        
              console.log(err);
              
        }//error


})();


