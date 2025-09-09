


/*

//google-storage.js:d

10-07-25


*/


(function(){

  var obj   = {
        version   : 'v1.0'
  };
  
        var df    = true;
        Object.defineProperty(obj,'df',{set:v=>df=v});
                                                                                debug(obj.version);  


//:


        var filetype        = 'google-storage';
        
        
        obj.bucket          = null;
        

        obj.parse           = parse;



        obj.file            = {};
        obj.file.load       = load;
        obj.load            = load;
        obj.file.save       = save;
        obj.file.delete     = del;
        obj.delete          = del;
        obj.save            = save;
        obj.file.save       = save;


        
        obj.dir             = {};
        obj.list            = dirlist;
        obj.dir.list        = dirlist;
        obj.dir.list.full   = dirlistfull;



        obj.token           = {};
        
        obj.refresh         = refresh;

        obj.tokenmod        = tokenmod;
        obj.token.mod       = tokenmod;


        
        
        obj.bucket          = {};
        obj.bucket.list     = bucketlist;
        




        obj.run             = {};
        obj.run.deploy      = deploy;
        obj.deploy          = deploy;
        obj.run.logs        = logs;
        obj.logs            = logs;



        
  //:


//  https://console.cloud.google.com/storage/browser/_details/ext-code-test_cloudbuild/test.txt;tab=live_object?inv=1&invt=Ab2X8w&project=ext-code-test
//  https://storage.googleapis.com/ext-code-test_cloudbuild/test.txt

        
        function parse(url){
        
              var bucket,path;
              
              if(url.indexOf('console.cloud.google.com')!=-1){
                    ({bucket,path}    = parse.console(url));
              }
              
              if(url.indexOf('storage.googleapis.com')!=-1){
                    ({bucket,path}    = parse.googleapis(url));
              }
              
              return {bucket,path};
              
        }//parse
        
        
        parse.console   = function(url){
        
              var bucket    = parse.slash(url,6);
              var i1        = parse.slash.index(url,7);
              var i2        = url.indexOf(';');
              var path      = url.slice(i1,i2);
              return {bucket,path};
              
        }//console
        
        
        parse.googleapis    = function(url){
        
              var bucket    = parse.slash(url,3);
              var i         = parse.slash.index(url,4);
              var path      = url.slice(i+1);
              return {bucket,path};
              
        }//googleapis
        
        
        parse.slash   = function(url,start,num=1){
        
              var i1    = parse.slash.index(url,start);
              i1       += 1;
              var i2    = parse.slash.index(url,start+num);
              if(i2==-1){
                    i2    = url.length;
              }
              
              var str   = url.slice(i1,i2);
              return str;
              
        }//slash
        
        
        parse.slash.index   = function(url,n){

              var index   = 0;
              var ct      = 0;
              var ec      = 0;
              
              while(ec==0){
              
                    index   = url.indexOf('/',index);
                    if(index==-1){
                          return -1;
                    }
                    
                    ct++;
                    if(ct==n){
                          return index;
                    }
                    index++;
                    
              }//while
              
        }//index
        
        
  //:


  //  https://cloud.google.com/storage/docs/downloading-objects
  
  
/*

curl -X GET \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -o "SAVE_TO_LOCATION" \
  "https://storage.googleapis.com/storage/v1/b/BUCKET_NAME/o/OBJECT_NAME?alt=media"
  
*/


  
        async function load({token,bucket,path}){
  
              if(arguments.length!=1){
                    [token,bucket,path]   = arguments;
              }
              
              bucket    ||= obj.bucket;
              
/*              
              if(arguments.length==2){
                    var i             = bucket.indexOf('/');
                    path              = bucket.slice(i+1);
                    bucket            = bucket.slice(0,i);
            }
*/            
              
              
              if(path.startsWith('/')){
                    path              = path.slice(1);
              }
              
              var i             = path.lastIndexOf('/');
              var filename      = path.slice(i+1);
              
              path              = encodeURIComponent(path);
              
              var url           = `https://storage.googleapis.com/storage/v1/b/${bucket}/o/${path}?alt=media`;
              var headers       = {authorization:`Bearer ${token}`};
              
              var err;
              try{
              
                    var res   = await fetch(url,{headers});
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = err.toString();
                    return {error};
              }
              
              if(!res.ok){
                    var error   = await res.text();
                    return {error};
              }
              
              var blob    = await res.blob();
              return {ok:blob,blob};
              
        }//load
        
        
/*

curl -X POST --data-binary @OBJECT_LOCATION \
    -H "Authorization: Bearer $(gcloud auth print-access-token)" \
    -H "Content-Type: OBJECT_CONTENT_TYPE" \
    "https://storage.googleapis.com/upload/storage/v1/b/BUCKET_NAME/o?uploadType=media&name=OBJECT_NAME"
    
*/

        
        async function save({token,bucket,path,blob}){
          
              if(arguments.length!=1){
                    [token,bucket,path,blob]    = arguments;
              }

              bucket    ||= obj.bucket;
              
/*
              if(arguments.length==3){
                    var i             = bucket.indexOf('/');
                    path              = bucket.slice(i+1);
                    bucket            = bucket.slice(0,i);
              }
*/              
              if(path.startsWith('/')){
                    path              = path.slice(1);
              }

              blob    = [...arguments].at(-1);              

/*        
              var i             = path.indexOf('/');
              var bucket        = path.slice(0,i);
              
              path              = path.slice(i+1);
*/


              
              var i             = path.lastIndexOf('/');
              var filename      = path.slice(i+1);

              //path              = encodeURIComponent(path);
              
              var url           = `https://storage.googleapis.com/upload/storage/v1/b/${bucket}/o?uploadType=media&name=${path}`;
              var method        = 'post';
              var headers       = {authorization:`Bearer ${token}`};
              var body          = blob;
              
              var err;
              try{
              
                    var res   = await fetch(url,{method,headers,body});
                    
              }
              catch(err2){
              
                    err   = err2;
                    
              }
              if(err){
                    var error   = err.toString();
                    return {error};
              }
              
              if(!res.ok){
                    var error   = await res.text();
                    return {error};
              }
              
              var txt   = await res.text();
                                                                                //console.log(txt);
              
              var ok    = 'ok';
              return {ok};
        
        }//save
        

        async function del({token,bucket,path}){
          
              if(arguments.length!=1){
                    [token,bucket,path]   = arguments;
              }

              if(path.startsWith('/')){
                    path    = path.slice(1);
              }
              path          = encodeURIComponent(path);
              
              var url       = `https://storage.googleapis.com/storage/v1/b/${bucket}/o/${path}`;
              var method    = 'delete';
              var headers   = {
                    authorization     : `Bearer ${token}`,
                    'content-type'    : 'application/json'
              };
              
              var err;
              try{
              
                    var res   = await fetch(url,{method,headers});
                    
              }
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                    return {error:err};
              }
              
              if(!res.ok){
                    var error   = await res.text();
                    return {error};
              }
                                                                                // Should be empty if successful
              var ok   = await res.text(); 
              return {ok};
        
        }//delete

    
        
        async function refresh({client_id,client_secret,refresh_token}){
          
              if(arguments.length!=1){
                    [client_id,client_secret,refresh_token]   = arguments;
              }
        
              var headers   = {'content-type':'application/x-www-form-urlencoded'};
              var body      = new URLSearchParams({client_id,client_secret,refresh_token,grant_type:'refresh_token'});
              var url       = 'https://oauth2.googleapis.com/token';
              
              var err;
              try{
                
                    var res       = await fetch(url,{method:'post',headers,body});
                    
              }
              catch(err2){
                
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = err.toString();
                    return {error};
              }
              
              if(!res.ok){
                    var error   = await res.text();
                    return {error};
              }
              
              
              var json      = await res.json();            
                                                                                console.json(json);
              var token     = json.access_token;
              return token;
              
        }//refresh



        parse.item    = function(path,item){

              var kind            = 'file';
              if(item.name.endsWith('/')){
                    kind          = 'dir';
              }
              
              var path2;
              var name;
              
              var t               = item.name;
              if(kind=='dir'){
                    t             = t.slice(0,-1);
              }
              
              var i               = t.lastIndexOf('/');
              name                = t.slice(i+1);
              var i               = -name.length;
              var len             = path.length;
              path2               = t.slice(len,i);
              
              var abs             = '/'+item.name;

      
              var file            = {};
              
              file.ft             = filetype;
              file.filetype       = filetype;
              
              file.abs            = abs;
              file.path           = abs;
              
              file.rel            = path2;
              file.name           = name;
              
              file.kind           = kind;
              file.type           = kind;
              file.size           = item.size;
      
              file.size           = item.size;
              file.md5            = item.md5Hash;
              file.link           = item.mediaLink;
              file.ctime          = item.timeCreated;
              file.mtime          = item.updated;
          
              return file;
              
        }//item
        
        
        async function dirlist({token,bucket,path,params}){

              bucket  ||= obj.bucket;        
              if(path.startsWith('/')){
                    path    = path.slice(1);
              }
              
              var url       = `https://storage.googleapis.com/storage/v1/b/${bucket}/o?delimiter=/`;
              
              if(path){
                    url    += '&prefix='+path;
              }
              
              var headers   = {authorization:`Bearer ${token}`};
              
              var err;
              try{
              
                    var res       = await fetch(url,{headers});
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = err.toString();
                    return {error};
              }
              
              if(!res.ok){
                    var error   = await res.text();
                    return {error};
              }
              
              var json    = await res.json();
              
              var dirs    = [];
              var files   = [];
              
              if(json.prefixes){
                    json.prefixes.forEach(dir=>{
                    
                          if(dir.endsWith('/')){
                                dir   = dir.slice(0,-1);
                          }
                          var i   = dir.lastIndexOf('/');
                          dir     = dir.slice(i+1);
                          
                          dirs.push(dir);
                          
                    });
              }
              
              if(json.items){
                    json.items.forEach(item=>{
                                                                                //console.log(item);
                          if(item.name===path){
                                return;
                          }
                          
                          var file    = parse.item(path,item);
                          
                          files.push(file);
                          
                    });
              }
        
              return {dirs,files};
              
        }//list
        
        
        async function dirlistfull({token,bucket,path,files_only}){
        
              bucket  ||= obj.bucket;
              if(path.startsWith('/')){
                    path    = path.slice(1);
              }
              if(!path.endsWith('/')){
                    path   += '/';
              }
              
              var url       = `https://storage.googleapis.com/storage/v1/b/${bucket}/o`;

/*
              if(path){
                    url    += 'prefix='+path;
              }              
*/              
              
              var headers   = {authorization:`Bearer ${token}`};
              var err;
              try{
              
                    var res   = await fetch(url,{headers});
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = err.toString();
                    return {error};
              }
              
              if(!res.ok){
                    var error   = await res.text();
                    return {error};
              }
              
              var json    = await res.json();
                                                                                      //console.log(json);
                                                                                      //console.log(path);
              var list    = [];
              
              if(json.items){
                    json.items.forEach(item=>{
                          
                          if(item.name.startsWith(path)){
                                                                                      //console.log(item);
                                if(item.name===path){
                                      return;
                                }
                                
                                var file    = parse.item(path,item);
                                
                                if(file.kind!='file' && files_only){
                                      return;
                                }

                                list.push(file);
                                
                          }
                          
                    });
              }
        
              return {list};
              
        }//full
        
        
  //:
  

        async function bucketlist({token,project}){
          
              if(arguments.length!=1){
                    [token,project]   = arguments;
              }
              
              project         = encodeURIComponent(project);
              var url         = `https://storage.googleapis.com/storage/v1/b?project=${project}`
              var headers     = {authorization:`Bearer ${token}`};
              
              var err;
              try{
                
                    var res   = await fetch(url,{headers});
                    
              }//try
              catch(err2){
                
                    err       = err2;
                    
              }//catch
              if(err){
                    var error   = err.toString();
                    return {error};
              }
              
              if(!res.ok){
                    var error   = await res.text();
                    return {error};
              }
              
              var buckets   = await res.json();
              return buckets;
              
        }//list
  
  
  //:
  
  
        async function deploy({token,email,bucket,zip,project,service,region}){

              bucket  ||= obj.bucket;
              
              var timeout   = '900s';
              var config    = {
              
                    serviceAccount    : `projects/${project}/serviceAccounts/${email}`,
      
                    source: {
                          storageSource: {bucket,object:zip}
                    },
                    steps: [
                          {
                                name    : 'gcr.io/cloud-builders/docker',
                                args    : ['build','-t',`gcr.io/${project}/${service}:latest`,'.']
                          },
                          {
                                name    : 'gcr.io/cloud-builders/docker',
                                args    : ['push',`gcr.io/${project}/${service}:latest`]
                          },
                          {
                                name    : 'gcr.io/cloud-builders/gcloud',
                                args    : [
                                                'run','deploy',service,
                                                '--image',`gcr.io/${project}/${service}:latest`,
                                                '--region',region,
                                                '--platform','managed',
                                                '--allow-unauthenticated'
                                          ]
                          },
                          {
                                name    : 'gcr.io/cloud-builders/gcloud',
                                args    : [
                                                'run','services','add-iam-policy-binding',service,
                                                '--region',region,
                                                '--member=allUsers',
                                                '--role=roles/run.invoker'
                                          ]
                          }
      
                          
                    ],
                    timeout,
                    options   : {
                          logging   : 'CLOUD_LOGGING_ONLY'
                    }
                    
              };
      
      
              var url       = `https://cloudbuild.googleapis.com/v1/projects/${project}/builds`;
              var headers   = {
                    authorization     : `Bearer ${token}`,
                    'content-type'    : 'application/json'
              };
              var method    = 'post';
              var body      = JSON.stringify(config);
      
              var err;
              try{
                
                    var res       = await fetch(url,{method,headers,body});
                    
              }//try
              catch(err2){
                
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = err.toString();
                    return {error};
              }
              if(!res.ok){
                    var error   = await res.text();
                    return {error};
              }
              
              var result    = await res.json();
        
              var build     = result.metadata.build.id;
              var logurl    = result.metadata.build.logUrl;

              
              return {result,monitor,build,logurl};

              
              async function monitor(callback){
              
                    var url       = `https://cloudbuild.googleapis.com/v1/projects/${project}/builds/${build}`;
                    var headers   = {authorization:`Bearer ${token}`};
                    
                    var done    = false;
                    var ct      = 0;
                    var max     = 50;
                    
                    while(!done){
                    
                          ct++;
                          if(ct==max){
                                callback(ct,'max');
                                return;
                          }
                          
                          var err;
                          try{
                            
                                var res       = await fetch(url,{headers});
                                
                          }//try
                          catch(err2){
                            
                                err   = err2;
                                
                          }//catch
                          if(err){
                                var error   = err.toString();
                                return {error};
                          }
                          if(!res.ok){
                                var error   = await res.text();
                                return {error};
                          }
                                
                          var json      = await res.json();
                                                                                console.log(json);
                                                                                console.log(ct,json.status);
                          var status    = json.status.toLowerCase();
                          
                          callback(ct,status);
                          
                          switch(status){
                          
                            case 'success'          :
                            case 'failure'          :
                            case 'internal_error'   :
                            case 'timeout'          :
                            case 'cancelled'        :
                                                      done    = true;
                                                      
                          }//switch
                          
                          await new Promise(res=>setTimeout(res,10_000));
                          
                    }//while
              
              }//monitor
              
        }//deploy
        
     
        async function logs({token,project,service}){
        
              var page    = null;
              var done    = false;
              var ct      = 0;
              var max     = 10;
              
              while(!done){
              
                    ct++;
                    if(ct==max){
                          done    = true;
                    }
                  
                    var method    = 'post';
                    var headers   = {
                          authorization     : `Bearer ${token}`,
                          'content-type'    : 'application/json'
                    };
                    var body    = JSON.stringify({
                          resourceNames   : [`projects/${project}`],
                          filter          : `resource.type="cloud_run_revision" AND resource.labels.service_name="${service}"`,
                          pageSize        : 50,
                          pageToken       : page
                    });
                    var url     = 'https://logging.googleapis.com/v2/entries:list';
                    
                    var err;
                    try{
                      
                          var res     = await fetch(url,{method,headers,body});
                          
                    }//try
                    catch(err2){
                      
                          err   = err2;
                          
                    }//catch
                    if(err){
                          var error   = err.toString();
                          return {error};
                    }
                    
                    if(!res.ok){
                          var error   = await res.text();
                          return {error};
                    }
                    
                    var data    = await res.json();
                                                                                console.log(data.entries);
                    page    = data.nextPageToken;
                    if(!page){
                          done    = true;
                    }
                                              
              }//while
        
        }//logs



  //:
  
  
  

        
function tokenmod(file,scopes,{fsp,crypto,platform}){
  
  var obj   = {};
        
        platform  ||= 'nodejs';
        if(datatype(crypto)=='crypto'){
              platform    = 'browser';
        }
                                                                                //console.log(platform);
        var email;
        var key;
  
        var expire;
        var token;
  
        var uri           = 'https://oauth2.googleapis.com/token';
        var skew          = 60;
        var max_expires   = 3600;
        
        
        var encoder       = new TextEncoder();
        
        
  //:


        Object.defineProperty(obj,'rd',{get:gettoken});


  //:
  
  
        var sign    = {};
        
        
  //:
  
        switch(scopes){
          
          case 'read'         : scopes    = ['https://www.googleapis.com/auth/devstorage.read_only'];           break;
          case 'read/write'   : scopes    = ['https://www.googleapis.com/auth/devstorage.read_write'];          break;
          case 'full'         : scopes    = ['https://www.googleapis.com/auth/devstorage.full_control'];        break;
          case 'auth'         : scopes    = ['https://www.googleapis.com/auth/cloud-platform'];                 break;
          
        }//switch
        
        
        if(platform=='nodejs'){
              load(file);
        }else{
              read(file);
        }
        
        
  //:
  
        
        async function load(file){
            
              var txt     = await fsp.readFile(file,'utf8');
              read(txt);
                  
        }//load

        
        async function read(v){
          
              var txt;
              var type    = datatype(v);
              switch(type){
                
                case 'blob'   : txt   = await blob.text();        break;
                default       : txt   = v;
                
              }//switch
              
              var json    = JSON.parse(txt);
          
              email       = json.client_email;
              key         = json.private_key;
                                                                                // Keyfiles often escape newlines as \n — normalize to PEM format
              key         = key.replaceAll('\\n','\n');
                                                                                //console.log(key);
              
        }//read
        
        
        async function importkey(pem){
        
              var buf       = pem_buf(pem);
              var params    = {name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'};
              var key       = await crypto.subtle.importKey('pkcs8',buf,params,false,['sign']);
              return key;
              
        }//importkey

        
        function pem_buf(pem){
        
              const b64   = pem.replace(/-----BEGIN [^-]+-----/g,'').replace(/-----END [^-]+-----/g,'').replace(/\s+/g,'');
                                                                                //console.log(b64);
              const raw   = atob(b64);
              const buf   = new Uint8Array(raw.length);
              for(let i=0;i<raw.length;i++){
                
                    buf[i]    = raw.charCodeAt(i);
                    
              }//for
              return buf.buffer;
              
        }//pem_buf
        
        

/*        
        function b64url(buf){
          
              if(typeof buf=='string'){
                    buf   = Buffer.from(buf);
              }
              
              var b64   = buf.toString('base64');
              
              b64       = b64.replaceAll('+','-');
              b64       = b64.replaceAll('/','_');
              b64       = b64.replaceAll('=','');
              return b64;
              
              
        }//b64url
*/

        function b64url(input){
        
              var bytes;
              var type    = datatype(input);
                                                                                //console.log('type',type);
              switch(type){
                
                case 'uint8array'   : bytes   = input;                        break;
                case 'string'       : bytes   = encoder.encode(input);        break;
                
              }//switch
              
              var bin     = bytes.reduce((acc,byte)=>acc+=String.fromCharCode(byte),'');
              var b64     = btoa(bin);
              
              b64         = b64.replaceAll('+','-');
              b64         = b64.replaceAll('/','_');
              b64         = b64.replaceAll('=','');
              
              return b64;
            
        }//base64url
  
        
        sign.nodejs   = function(key,data){
          
              var signer    = crypto.createSign('RSA-SHA256');
              signer.update(data);
              signer.end();
              var buf   = signer.sign(key);
              var b64   = b64url(buf);
              return b64;
              
        }//signRS256
        
        
        sign.browser    = async function(key,data){
        
              key         = await importkey(key);
              var bytes   = encoder.encode(data);
              var sig     = await crypto.subtle.sign({name:'RSASSA-PKCS1-v1_5'},key,bytes);
              var buf     = new Uint8Array(sig);
              var b64     = b64url(buf);
              return b64;
              
        }//browser
        
  
        
        async function build(){
          
              var now               = Math.floor(Date.now()/1000);
              
              var iss               = email;
              var aud               = uri;
              var iat               = now;
                                                                                // 1 hour max for service account JWT flow
              var exp               = now+max_expires; 
              var scope             = scopes.join(',');
            
              var header            = {alg:'RS256',typ:'JWT'};
              header                = b64url(JSON.stringify(header));
              var payload           = {iss,scope,aud,iat,exp};
              payload               = b64url(JSON.stringify(payload));
              
              var toSign            = `${header}.${payload}`;
              var signature         = await sign[platform](key,toSign);
              
              var str               = `${toSign}.${signature}`;
              return str;
          
        }//build
  
        
        async function exchange(assertion){
          
              var headers       = {'content-type':'application/x-www-form-urlencoded'};
              var grant_type    = 'urn:ietf:params:oauth:grant-type:jwt-bearer';
              var body          = new URLSearchParams({grant_type,assertion});
  
              var err;
              try{
                
                    var res   = await fetch(uri,{method:'post',headers,body});
                    
              }//try
              catch(err2){
                
                    err   = err2;
                    
              }//catch
              if(err){
              }
            
              if(!res.ok){
                    const text = await res.text().catch(() => '');
                    throw new Error(`Token exchange failed: ${res.status} ${res.statusText} ${text}`);
              }
            
                                                                                // {access_token,token_type,expires_in}
              var json    = await res.json();
              
              token       = json.access_token;
              expire      = json.expires_in;
              var now     = Math.floor(Date.now()/1000);              
              expire     += now;
                                                                                //console.log(expire,expire-now);
        }//exchange
  
  
        async function gettoken(){
            
              var now   = Math.floor(Date.now()/1000);              
              if(token && now<expire-skew){
                                                                                //console.log('cache');
                    return token;
              }
                                                                          
              var assertion   = await build();
              await exchange(assertion);
              return token;  
              
        }//gettoken
          
      
  return obj;

}//tokenmod

  
  
  //:
  
  
        function datatype(v){
        
              var str   = Object.prototype.toString.call(v);
              str       = str.slice(8,-1);
              str       = str.toLowerCase();
              return str;
              
        }//datatype  
        
  //:
  
  
        function debug(){
        
              if(!df)return;
              var str   = [...arguments].join(' ');
              console.log('[ google-storage-api ]',str);
              
        }//debug
        
        
  //:
  
  
  return obj;
  
})();


