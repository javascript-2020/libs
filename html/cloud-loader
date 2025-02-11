


/*

//cloud-run-function.html-loader:d

10-02-25


*/


				exports['html-loader']    = request;


				async function request(req,res){

              var mode    = 'raw';
              var nodename;
              
							var url     = req.url.slice(1);

					    if(url.endsWith('.api')){
					          url     = url.slice(0,-4);
					          mode    = 'api';
					    }

							var i	=	url.indexOf('?');
							if(i!=-1){
										nodename		=	url.slice(i+1);
										nodename    = decodeURI(nodename);
							}

					    
					    var txt   = await load[mode](res);
					    if(!txt)return;
					    
							if(nodename){
										var i		=	txt.indexOf('/* params */');
										i			  =	txt.indexOf('\n',i)+1;
										txt		  =	txt.slice(0,i)+`var nodename='${nodename}';`+txt.slice(i+1);
							}
							
							var headers                               = {};
							headers['content-type']                   = 'text/javascript';
							headers['cross-origin-resource-policy']   = 'cross-origin';
							
							res.writeHead(200,headers);
							res.end(txt);

				}//request


        var load    = {};
        
        load.raw=async function(res){
        
							var url   =	'https://raw.githubusercontent.com/javascript-2020/libs/main/html/html-loader.js';
							
							var err;
							try{
										var res2		=	await fetch(url);
										var txt			=	await res2.text();
							}
							catch(err2){
										err		=	err2;
							}
							if(err){
							      error(res,err);
							      return;
							}
              
              return txt;
              
        }//raw

        
        load.api=async function(res){
        
              var token   = '';
              var url     = 'https://api.github.com/repos/javascript-2020/libs/contents/html/html-loader.js';
              
              var err;
              try{
                    var opts    = {headers:{authorization:`bearer ${token}`}};
                    var res2    = await fetch(url,opts);
                    var json    = await res.json();
                    var b64     = json.content;
                    var txt     = atob(b64);
              }
              catch(err2){
                    err   = err2;
              }
              if(err){
                    error(res,err);
                    return;
              }
              
              return txt;
              
        }//api
        
        
        function error(res,err){
        
							res.writeHead(500);
							res.end(`
							
							      error loading : github:libs/html/html-loader.js
							      
							      ${err.toString()}
							      
							 `);
        
        }//error







        
