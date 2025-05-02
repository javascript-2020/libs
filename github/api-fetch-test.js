


(async()=>{


        var owner     = 'javascript-2020';
        var repo      = 'tmp';
        var branch    = 'main';
        var path      = 'dir/a.js';
        
        var url       = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=true`;
        var json      = await fetch(url).then(res=>res.json()).catch(error);

        console.json(json);
        
        function error(err){
        
              console.log(err);
              
        }//error

})();