


/*

ftp-server:d

25-04-25


*/
                                                                                console.clear();
                                                                                terminal_title('ftp-server');
                                                                                //console.log(process.argv);
                                                                                console.log();
                                                                                console.json=v=>console.log(JSON.stringify(v,null,4));
        var auth          = argv('auth')||'matt-123';
        var dir           = argv('d','dir')||'';
        var port          = argv('p','port')||3001;
        
        var path          = require('path');
        var fs            = require('fs');
        var fsp           = fs.promises;
        var {O_CREAT}     = fs.constants;
                                                                                if(0){
                                                                                  var test   = process.argv[2];
                                                                                  console.log('test :',test);
                                                                                  resolve(test);
                                                                                  
                                                                                  process.exit();
                                                                                }
        var ftp               = require('basic-ftp');

        var client            = new ftp.Client()
        client.ftp.verbose    = false;
        try{
              await client.access({
                    host        : '192.168.8.126',
                    port        :'2222',
                    password    : 'hello@example.com',
                    secure      : false
              })
              console.log(await client.list('Internal shared storage'))
              //await client.upload(fs.createReadStream("README.md"), "README.md")
        }
        catch(err){
              console.log(err)
              process.exit();
        }
        
        
        var getmime       = require('getmime.js');
        var keys          = require('keys.js');
        
        var key;
        var cert;
        
        var abs           = path.resolve(__dirname,dir);
        if(!abs.endsWith('/')){
              abs  += '/';
        }

        
        resolve.df    = false;

        
  //:
  
        setTimeout(init,50);
        
        function init(){
        
              load_cert();
              
              require('https').createServer({key,cert},request).listen(port,'localhost');
                                                                                console.log(`listening https://localhost:${port}/`);
                                                                                console.log();
                                                                                console.log('serving :',abs);
                                                                                console.log();
                                                                                console.log('===');
                                                                                console.log();
        }//init
        
        
        function load_cert(){
        
              var load    = '';
              if(fs.existsSync('key.pem')){
                    key   = fs.readFileSync('key.pem','utf8');
                    load += 'key.pem ';
              }
              if(fs.existsSync('cert.pem')){
                    cert    = fs.readFileSync('cert.pem','utf8');
                    if(load){
                          load   += ',';
                    }
                    load += 'cert.pem';
              }
              if(load){
                                                                                console.log('load',load);
              }
        
        }//load_cert

        
  //:
  
  
        function request(req,res){
        
              if(cors(req,res)){
                                                                                request.log(req);
                    return;
              }
                    
              if(auth){
                    if(req.headers.auth!==auth){
                                                                                request.log(req);
                          unauthorised(req,res);
                          return;
                    }
              }
              
              var fn    = resolve.req(req);
              if(fn===false){
                                                                                request.log(req);
                    badreq(req,res,'invalid url');
                    return;
              }
              
              var mode      = req.headers.mode;
                                                                                request.log(req,mode,fn);
              var handled   = true;
              switch(mode){
              
                case 'mkfile'       : mkfile(req,res,fn);         break;
                case 'rmfile'       : rmfile(req,res,fn);         break;
                case 'rmdir'        : rmdir(req,res,fn);          break;
                case 'mkdir'        : mkdir(req,res,fn);          break;
                case 'readdir'      : readdir(req,res,fn);        break;
                case 'dir-clear'    : dirclear(req,res,fn);       break;
                case 'load'         : load(req,res,fn);           break;
                case 'save'         : save(req,res,fn);           break;
                case 'upload'       : upload(req,res,fn);         break;
                case 'download'     : download(req,res,fn);       break;
                
                default             : handled   = false;
                
              }//switch
              
              if(handled){
                    return;
              }
              
              unknown(req,res,mode);
              
        }//request

        
        request.log   = function(req,mode,fn){
        
              var spc   = [10,20,10,20];
              var str   = [req.method,req.url];
              if(mode){
                    str.push(mode,fn);
              }
              str   = str.map((str,i)=>str.padEnd(spc[i]));
              str   = str.join(' ');
              
              console.log(str);
              
        }//log
        
        
        resolve.req   = function(req){
        
              var url       = req.url;
              url           = url.slice(1);
              var result    = resolve(url);
              return result;
              
        }//req
        
        
        function resolve(url,docroot=dir){
                                                                                resolve.df && console.log('=== resolve ===');
                                                                                resolve.df && console.log('url :',url);
                                                                                resolve.df && console.log('docroot :',docroot);
              url         = decodeURI(url);
                                                                                resolve.df && console.log('url :',url);
              var p2      = path.resolve(docroot);
                                                                                resolve.df && console.log('p2 :',p2);
              var file    = path.resolve(docroot,url);
                                                                                resolve.df && console.log('file :',file);
              var s       = file.substring(0,p2.length);
                                                                                resolve.df && console.log('s :',s);
              var p1      = path.resolve(s);
                                                                                resolve.df && console.log('p1 :',p1);
              if(p1!==p2){
                                                                                resolve.df && console.log('fail');
                    return false;
              }
              
              if(url.endsWith('/')){
                    file   += '/';
              }
                                                                                resolve.df && console.log('ok',file);
              return file;

        }//resolve
        
        
        function cors(req,res){
        
              if(req.method!=='OPTIONS'){
                    return;
              }

              cors.headers(res);              
              res.end();
              
              return true;
              
        }//cors
        
        
        cors.headers   = function(res){
        
              res.setHeader('access-control-allow-origin','*');
              res.setHeader('access-control-allow-headers','auth, mode,content-type');
        
        }//header
        
        
        function notfound(req,res){
        
              cors.headers(res);
              res.writeHead(404);
              res.end(req.url+' not found');
              
        }//notfound
        
        
        function unauthorised(req,res){
                            
              cors.headers(res);
              res.writeHead(401);
              res.end('unauthorised');
              
        }//unauthorised
  
        
        function badreq(req,res,reason){
        
              cors.headers(res);
              res.writeHead(400);
              res.end(reason);
              
        }//badreq
        
        
        function unknown(req,res,mode){
        
              cors.headers(res);
              res.writeHead(400);
              res.end(`unknown mode : ${mode}`);
        
        }//unknown
        
        
  //:
  
        
        function mkfile(req,res,fn){
        
              var err;
              try{
              
                    var file    = fs.openSync(fn,O_CREAT);
                    
              }
              catch(err2){
              
                    err   = err2;
                    
              }
              if(err){
                    cors.headers(res);
                    res.writeHead(400);
                    res.end(err.toString());
                    return;
              }
              
              fs.closeSync(file);
              
              cors.headers(res);
              res.end('ok');
              
        }//mkdir
        
        
        function rmfile(req,res,fn){
        
              var err;
              try{
              
                    fs.rmSync(fn,{recursive:true,force:true});
                    
              }
              catch(err2){
              
                    err   = err2;
                    
              }
              if(err){
                    cors.headers(res);
                    res.writeHead(400);
                    res.end(err.toString());
                    return;
              }
              
              cors.headers(res);
              res.end('ok');
              
        }//rmfile
        
        
        function rmdir(req,res,fn){
        
              var err;
              try{
              
                    fs.rmSync(fn,{recursive:true,force:true});
                    
              }
              catch(err2){
              
                    err   = err2;
                    
              }
              if(err){
                    cors.headers(res);
                    res.writeHead(400);
                    res.end(err.toString());
                    return;
              }
              
              cors.headers(res);
              res.end('ok');
              
        }//rmdir
        
        
        function mkdir(req,res,fn){
        
              var err;
              try{
              
                    fs.mkdirSync(fn,{recursive:true});
                    
              }
              catch(err2){
                
                    err   = err2;
                    
              }
              if(err){
                    cors.headers(res);
                    res.writeHead(400);
                    res.end(err.toString());
                    return;
              }
              
              cors.headers(res);
              res.writeHead(200);
              res.end('ok');
                  
        }//mkdir

        
        function readdir(req,res,fn){
        
              if(!fs.existsSync(fn)){
                    notfound(req,res);
                    return;
              }
              
              var dirs    = [];
              var files   = [];
              
              var list    = fs.readdirSync(fn,{withFileTypes:true});
              list.forEach(file=>{
              
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

              var str   = JSON.stringify({files,dirs});
              
              cors.headers(res);
              res.writeHead(200);
              res.end(str);
              
        }//readdir
        
        
        async function dirclear(req,res,fn){
                                                                                console.log('dirclear',fn);
              var err;
              try{
              
                    fs.mkdirSync(fn,{recursive:true});
                    
              }
              catch(err2){
                
                    err   = err2;
                    
              }
              if(err){
                    cors.headers(res);
                    res.writeHead(400);
                    res.end(err.toString());
                    return;
              }
              
              
              var list      = await fsp.readdir(fn);
              var errors    = [];
              list.forEach((name,i)=>{

                    var err;
                    try{
                    
                          var abs   = fn+name;
                                                                                console.log(i,abs);
                          fs.rmSync(abs,{recursive:true,force:true});
                          
                    }
                    catch(err2){
                                                          
                          err   = err2;
                          
                    }
                    if(err){
                                                                                console.log(err);
                          errors.push(err.toString());
                    }
                    
              });

              if(errors.length){
                    var str   = errors.join('\n');
                    cors.headers(res);
                    res.writeHead(400);
                    res.end(str);
                    return;
              }
              
              cors.headers(res);
              res.end('ok');
              
        
        }//dirclear
        
        
        function load(req,res,fn){

              if(!fs.existsSync(fn)){
                    notfound(req,res);
                    return;
              }
              
              var mime      = getmime(fn);
              var stream    = fs.createReadStream(fn);

              cors.headers(res);
              res.writeHead(200,{'content-type':mime});
              stream.pipe(res);
              
        }//load
        
        
        function save(req,res,fn){

              /*
              if(!fs.existsSync(fn)){
                    notfound(req,res);
                    return;
              }
              */
              
              var err;
              try{
              
                    var stream    = fs.createWriteStream(fn);
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                    var str   = 'invalid filename : '+fn+'\n'+err.toString();
                    badrequest(req,res,str)
                    return;
              }
              
              req.pipe(stream);
              req.on('end',()=>{
              
                    cors.headers(res);
                    res.writeHead(200);
                    res.end();
                    
              });
                            
        }//save
        
        
        function upload(req,res,fn){
              
              var stream    = fs.createWriteStream(fn);
              req.pipe(stream);
              req.on('end',()=>{
              
                    cors.headers(res);
                    res.writeHead(200);
                    res.end('ok');
                    
              });

        }//upload
        
        
        function download(req,res,fn){

              if(!fs.existsSync(fn)){
                    notfound(req,res);
                    return;
              }
              
              if(!fs.statSync(fn).isFile()){
                    badreq(req,res,'not file');
                    return;
              }
              
              var mime      = getmime(fn);
              var stream    = fs.createReadStream(fn);

              cors.headers(res);
              res.writeHead(200,{'content-type':mime});
              stream.pipe(res);
        
        }//download
        
        
        
        
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



          function terminal_title(str){
                                                                                console.log(str);
                                                                                console.log();
                var esc   = String.fromCharCode(27);
                var c7    = String.fromCharCode(7);
                var cmd   = `${esc}]0;${str}${c7}`;
                process.stdout.write(cmd);
                
          }//terminal_title

        
        
  //:
  
        cert    = 
              '-----BEGIN CERTIFICATE-----\n'                                       +
              'MIIDcjCCAlqgAwIBAgIBATANBgkqhkiG9w0BAQUFADAlMSMwIQYDVQQDExpsb2Nh\n'  +
              'bGhvc3QgdGVzdCBjZXJ0aWZpY2F0ZTAeFw0yNTA2MjYxNzQ5MDBaFw0yNjA2MjYx\n'  +
              'NzQ5MDBaMCUxIzAhBgNVBAMTGmxvY2FsaG9zdCB0ZXN0IGNlcnRpZmljYXRlMIIB\n'  +
              'IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqWZ5x4R8GVoRKeXe++SN54Mz\n'  +
              'UD1BD/eNfmELIedKeof0m/CxXQZn2KyxYzvPmCKM6qv0Y458sadmaG0HQGUb55lm\n'  +
              'ox6T7U5LjF3C7HM2PZjuQw5Z4nnCEcu/yEcqNU/a5b9noBY132v/0iIvOn5f4ptQ\n'  +
              'Z8JslU6YmCdznt23rgHUjcOxLYdU8xT53HwEvxZoem8hVIYek+mX2nU8AIj0WMx+\n'  +
              'piqaxtxFHv6PNmNe6M81ggxLTr7DvECS+Nl+s5ec7uOClsgafKt5ZxvYufsI7vxT\n'  +
              'C47/Co2TYuNgpIVqmpykg1YxKyElGzSIpB7bzDlqq8erU98kjCYzjTiy67KJuQID\n'  +
              'AQABo4GsMIGpMAkGA1UdEwQCMAAwIAYDVR0RBBkwF4IJbG9jYWxob3N0hwR/AAAB\n'  +
              'hwR/AAACMB0GA1UdDgQWBBRN+qxeeW3ngsZaImHYKWaf4ztRkDALBgNVHQ8EBAMC\n'  +
              'AvQwOwYDVR0lBDQwMgYIKwYBBQUHAwIGCCsGAQUFBwMDBggrBgEFBQcDBAYIKwYB\n'  +
              'BQUHAwEGCCsGAQUFBwMIMBEGCWCGSAGG+EIBAQQEAwIA5zANBgkqhkiG9w0BAQUF\n'  +
              'AAOCAQEAgoAgtNpwyHjf/lEaYNxPXU3IuvpBJb0J2pU/vU3ImGTZoCpEjqAnduUB\n'  +
              'zPIL9jk2xoIn4w2u8h4AALi/0+8/w+Lf39EGVw2v5Obd5/L00aRtYq4syitWh7st\n'  +
              'cGiJhL6OR6sZw1/Z+MsQWoXn1K8wEusalNs9zTimpn/wt+fFFem5Ao5sFKp7OvxE\n'  +
              'tJGOIjEq0ErBvbejRMLQTFHaBKsSyA/G8fFyQaAdnOuPHpJJjNfWhrNfr3kxuKsF\n'  +
              'c7BcCD7p6Q3GVcUsIpAudj6k0ueDottTlQ7PVwiJlWTISvzCrz4dI1dwE7VpZ04Y\n'  +
              'AZpOcmiSQO2WFjUS/N5y9g+zJs/Osw==\n'                                  +
              '-----END CERTIFICATE-----\n'
        ;

        key   =
              '-----BEGIN RSA PRIVATE KEY-----\n'                                   +
              'MIIEpAIBAAKCAQEAqWZ5x4R8GVoRKeXe++SN54MzUD1BD/eNfmELIedKeof0m/Cx\n'  +
              'XQZn2KyxYzvPmCKM6qv0Y458sadmaG0HQGUb55lmox6T7U5LjF3C7HM2PZjuQw5Z\n'  +
              '4nnCEcu/yEcqNU/a5b9noBY132v/0iIvOn5f4ptQZ8JslU6YmCdznt23rgHUjcOx\n'  +
              'LYdU8xT53HwEvxZoem8hVIYek+mX2nU8AIj0WMx+piqaxtxFHv6PNmNe6M81ggxL\n'  +
              'Tr7DvECS+Nl+s5ec7uOClsgafKt5ZxvYufsI7vxTC47/Co2TYuNgpIVqmpykg1Yx\n'  +
              'KyElGzSIpB7bzDlqq8erU98kjCYzjTiy67KJuQIDAQABAoIBABblbOxUsdlTXSKG\n'  +
              'mV7+g1eZWiQsQ1D/Kra8Mx7//gcVvTAeljp2lS6qGMfK28I6WUWWvE+AgMYaVDMl\n'  +
              'GWfQwrbI+yBtD51xibCNM711zQ0CUKHrnKaJwntZSLCvPbs68eE/v6fZmKp8FHW4\n'  +
              'fR2w2xDr4TBFDRwZJXLbUjtUyHDSQSMUiIfAsJoDTloAsYXGm5bqVv+9mxvli0gp\n'  +
              'lmiFW3CZCmZC9vjid1Gn4CI3SpwU/Mu6a8ldvA/fU6WnTJ+Wlpi8DcvacmaHLqAd\n'  +
              'U+CXchyi1/Q6TmG3a82QRIntSLA4R+tr6OLQprMre1C9Mb/e+7L0TG0TCYlKLuvj\n'  +
              '4W3PgckCgYEA/TEYkDtc0m4nXmPwxYJQkPyMT/BGqvoAcKBu7EF28+bN8de53SHP\n'  +
              'PREsdFgN/vPGvjHsIXhPyNmRkw+kRYtUCmUWD2SJN0weZ0d+Q3NtGSfLiXIlJwaT\n'  +
              '/vlyxevVg+JW/8c5sL7Fj4vAVxJCJzYM9Kzvsst4t85eAY/DIp09W6cCgYEAq0d3\n'  +
              'D7aJwWLi2IdPjW2rJ/bdgLMDUGo0x85RCBH2qb7MPAVenQylcknXXvSLrwv93PbJ\n'  +
              'w+IQuS1hRXmRLSq24TmOX7hWLILBhUh7bEwQqW6cr0TX4QgkbI8CJNwfyTKqj0ye\n'  +
              'UEEUCnBaDboTqPAXM9+EAQwzmaSlkQM3VPQ0G58CgYEAve/yyWB/Ba11Ay5eFQzp\n'  +
              'e5q5d858dQ8O/W6dR8bkgZwHqwF2gRk36kvT2YOlHDmsQkoZJhKnZ7kvp+74AOPA\n'  +
              'q/uhTPLSrRUBSeEsK1WP5msgGX/ztw8MPx7KpweAKWvGcCL4eErk0ga4x5j+34OA\n'  +
              'vJxvROW3Lcw2YV2DuZfTy8kCgYABv5gCjA158OV56l+whOcTYFzAfJNTFdJ2G7AO\n'  +
              'EgjfkLgLAM8HcWKa+Q/+wyZN4iR0RfynSD59dW4hxGzr9hypzembJomSqL8K+kNw\n'  +
              'RpKA+EUXMO+3N1sP1KHj+G9GoYLGNbUEArYOqTjyHO0oc1L5T5XMYPCB6AFcqpi9\n'  +
              'AEUr5wKBgQC/m5Eq2XWG2XP1i3G0ut0ierM8+XXw1ydiyAOuHM3aUBwtCirsIBAd\n'  +
              'kGlVjhwrYIs6DfcPf0hdroPmEHl8BBb1zGUISYZSNhVY2Sxfut26nYAIV85pSmrg\n'  +
              'Lk1ryU8dYQMT7+7GqxfSaznp6iGm/Blfcnk9YbBOgvs7i6ewJC49kg==\n'          +
              '-----END RSA PRIVATE KEY-----\n'
        ;
        
        



