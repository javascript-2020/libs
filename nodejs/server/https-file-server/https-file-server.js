


/*

https-file-server:d

25-04-25


*/
                                                                                console.clear();
                                                                                console.log('https-file-server');
                                                                                console.log();
                                                                                console.json=v=>console.log(JSON.stringify(v,null,4));
        var auth          = argv('auth')||'matt-123';
        var dir           = argv('d','dir')||'';
        var port          = argv('p','port')||3000;
        
        var path          = require('path');
        var fs            = require('fs');
        
        var getmime       = require('getmime.js');
        
        var key           = fs.readFileSync('key.pem');
        var cert          = fs.readFileSync('cert.pem');
        
        var abs           = path.resolve(__dirname,dir);
        if(!abs.endsWith('/')){
              abs  += '/';
        }
        
        require('https').createServer({key,cert},request).listen(port);
                                                                                console.log(`listening https://localhost:${port}/`);
        
  //:
  
  
        function request(req,res){
                                                                                console.log(req.method,req.url);
              if(cors(req,res))return;
              
              if(auth){
                    if(req.headers.auth!==auth){
                          unauthorised(req,res);
                          return;
                    }
              }
              
              var url   = req.url.slice(1);
              var fn    = path.resolve(abs,url);

              if(!fs.existsSync(fn)){
                    notfound(req,res);
                    return;
              }
              
              var mode    = req.headers.mode;
                                                                                console.log(mode,fn);
              switch(mode){
              
                case 'dir'    : dir(req,res,fn);        break;
                case 'load'   : load(req,res,fn);       break;
                case 'save'   : save(req,res,fn);       break;
                
              }//switch
              
        }//request
        
        
        function cors(req,res){
        
              if(req.method!=='OPTIONS'){
                    return;
              }
              
              res.setHeader('access-control-allow-origin','*');
              res.setHeader('access-control-allow-headers','auth mode');
              res.end();
              
              return true;
              
        }//cors
        
        
        function notfound(req,res){
        
              res.writeHead(404);
              res.end(req.url+' not found');
              
        }//notfound
        
        
        function unauthorised(req,res){
        
              res.writeHead(401);
              res.end('unauthorised');
              
        }//unauthorised
  
        
  //:
  
        
        function dir(req,res,fn){
        
              var dirs        = [];
              var filenames   = [];
              
              var files   = fs.readDirSync(fn,{withFileTypes:true});
              files.forEach(file=>{
              
                    if(file.name=='.' || file.name=='..'){
                          return;
                    }
                    
                    if(file.isDirectory()){
                          dirs.push(file.name);
                    }
                    if(file.isFile()){
                          files.push(file.name);
                    }
                    
              });

              res.setHeader('access-control-allow-origin','*');              
              res.writeHead(200);
              res.end(JSON.stringify({filenames,dir});
              
        }//dir
        
        
        function load(req,res,fn){
        
              var mime      = getmime(fn);
              var stream    = fs.createReadStream(fn);

              res.setHeader('access-control-allow-origin','*');
              res.writeHead(200,{'content-type':mime});
              stream.pipe(res);
              
        }//load
        
        
        function save(req,res,fn){

              var stream    = fs.createWriteStream(fn);
              req.pipe(stream);
              req.on('end',()=>{
              
                    res.setHeader('access-control-allow-origin','*');
                    res.writeHead(200);
                    res.end();
                    
              });
                            
        }//save
        
        
  //:
  
  
        function argv(id0){
        
              var nj    = arguments.length;
              
              var ni   = process.argv.length;
              for(var i=0;i<ni;i++){
              
                    var id2   = process.argv[i];
                    for(var j=0;j<nj;j++){
                    
                          var id    = arguments[j];
                          
                          switch(id2){
                          
                            case id           :
                            case `-${id}`     :
                            case `--${id}`    : return process.argv[i+1];
                            
                          }//switch
                    
                    }//forj
                    
              }//fori
              
              return null;
              
        }//argv
        
        
        
        
        