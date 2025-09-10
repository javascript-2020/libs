


/*

//cloud-run-function.html-loader:d

10-02-25
39-04-25    version 2

*/


				exports['html-loader']    = request;

				
				var df          = true;

        var fs;
        
        var mode        = 'api';
        var url         = {};
        url.raw         = 'https://raw.githubusercontent.com/javascript-2020/libs/main/html/html-loader.js';
        url.api         = 'https://api.github.com/repos/javascript-2020/libs/contents/html/html-loader.js';

        
        var platform    = 'cloud';
        if(platform==='local'){
              fs    = require('fs');
        }

        
				async function request(req,res){

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
										if(!validate(nodename)){
										      res.writeHead(400);
										      res.end();
										      return;
										}
										                                                            df && console.log('url ?',nodename);
						  }

					    
					    var txt   = await load(res);
					    if(txt===false){
					          res.writeHead(500);
					          res.end();
					          return;
					    }
					    
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


        async function load(res){
        
              var txt;
              
              if(platform=='local'){
                                                                                df && console.log('local','html-loader.js');
                    txt   = fs.readFileSync('html-loader.js');
              }else{
                    txt   = await load[mode](res);
              }
              
              return txt;
              
        }//load
        
        
        load.raw    = async function(res){
        
							var err;
							try{
										var res2		=	await fetch(url.raw);
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

        
        load.api    = async function(res){
        
              var token   = '';
              
              var err;
              try{
                    var opts    = {headers:{authorization:`bearer ${token}`}};
                    var res2    = await fetch(url.api,opts);
                    var json    = await res2.json();
                    var b64     = json.content;
                    var txt     = atob(b64);
              }
              catch(err2){
                    err   = err2;
              }
              if(err){
                    error(res,err);
                    return false;
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


        function validate(str){
          
              if(str.length!=32)return;
              if(!str.startsWith('[html-loader=x'))return;
              if(!str.endsWith(']'))return;
              for(var i=14;i<31;i++){
                
                    var c   = str[i];
                    if(c<'0' || c>'9')return;
                    
              }//for
              return true;
              
        }//validate





        
