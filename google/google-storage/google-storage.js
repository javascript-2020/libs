


/*

//google-storage.js:d

10-07-25


*/


(function(){

  var obj   = {
        version   : 'v1.0'
  };
  
        var df    = true;
                                                                                debug(obj.version);  
  //:


//  https://console.cloud.google.com/storage/browser/_details/ext-code-test_cloudbuild/test.txt;tab=live_object?inv=1&invt=Ab2X8w&project=ext-code-test
//  https://storage.googleapis.com/ext-code-test_cloudbuild/test.txt

        obj.parse   = parse;
        
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

        obj.load    = load;
  
        async function load(token,bucket,path){
  
              if(arguments.length==2){
                    var i             = bucket.indexOf('/');
                    path              = bucket.slice(i+1);
                    bucket            = bucket.slice(0,i);
              }
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
              
              var blob    = await res.blob();
              return {ok:blob,blob};
              
        }//load
        
        
/*

curl -X POST --data-binary @OBJECT_LOCATION \
    -H "Authorization: Bearer $(gcloud auth print-access-token)" \
    -H "Content-Type: OBJECT_CONTENT_TYPE" \
    "https://storage.googleapis.com/upload/storage/v1/b/BUCKET_NAME/o?uploadType=media&name=OBJECT_NAME"
    
*/

        obj.save    = save;
        
        async function save(token,bucket,path,blob){

              if(arguments.length==3){
                    var i             = bucket.indexOf('/');
                    path              = bucket.slice(i+1);
                    bucket            = bucket.slice(0,i);
              }
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
        

        obj.delete    = async function(token,bucket,path){

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

    
        obj.refresh   = refresh;
        
        async function refresh(client_id,client_secret,refresh_token){
        
              var headers   = {'content-type':'application/x-www-form-urlencoded'};
              var body      = new URLSearchParams({client_id,client_secret,refresh_token,grant_type:'refresh_token'});
              var url       = 'https://oauth2.googleapis.com/token'
              var res       = await fetch(url,{method:'post',headers,body});
              var json      = await res.json();            
                                                                                console.json(json);
              var token     = json.access_token;
              return token;
              
        }//refresh



        obj.list    = list;
        
        async function list(token,path){
        
              if(path.startsWith('/')){
                    path    = path.slice(1);
              }
              
              var url       = 'https://storage.googleapis.com/storage/v1/b/ext-code-test_cloudbuild/o?delimiter=/';
              
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
                          var i         = item.name.lastIndexOf('/');
                          var name      = item.name.slice(i+1);
                          if(!name){
                                return;
                          }
                          
                          var file      = {};
                          file.name     = name;
                          file.size     = item.size;
                          file.md5      = item.md5Hash;
                          file.link     = item.mediaLink;
                          file.ctime    = item.timeCreated;
                          file.mtime    = item.updated;
                          
                          files.push(file);
                          
                    });
              }
        
              return {dirs,files};
              
        }//list
        
        
        list.full   = async function(token,bucket,path){
        
              if(path.startsWith('/')){
                    path    = path.slice(1);
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
              var files   = [];
              
              if(json.items){
                    json.items.forEach(item=>{
                          
                          if(item.name.startsWith(path)){
                                                                                      //console.log(item);
                                var name    = item.name.slice(path.length);
                                if(name.startsWith('/')){
                                      name    = name.slice(1);
                                }
                                
                                var file    = {};
                                file.name   = name;
                                
                                files.push(file);
                          }
                          
                    });
              }
        
              return {files};
              
        }//full
        
  
  //:
  
  
        obj.deploy    = async function({email,zip,project,service,token}){
        
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
                                                'run','deploy',func,
                                                '--image',`gcr.io/${project}/${service}:latest`,
                                                '--region',region,
                                                '--platform','managed',
                                                '--allow-unauthenticated'
                                          ]
                          },
                          {
                                name    : 'gcr.io/cloud-builders/gcloud',
                                args    : [
                                                'run','services','add-iam-policy-binding',func,
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
      
              
              var res       = await fetch(url,{method,headers,body});
              var result    = await res.json();
        
              return result;
              
        }//deploy
        
        
  //:
  
  
        function debug(){
        
              if(!df)return;
              var str   = [...arguments].join(' ');
              console.log('[ google-storage-api ]',str);
              
        }//debug
        
        
  //:
  
  
  return obj;
  
})();


