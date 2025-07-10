


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
        
              var bucket    = parse.slash(url,5);
              var i1        = parse.slash.index(url,6);
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
  
        async function load(token,path){
  
              var i             = path.indexOf('/');
              var bucket        = path.slice(0,i);
              
              path              = path.slice(i+1);
              
              var i             = path.lastIndexOf('/');
              var filename      = path.slice(i+1);
              
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
              return {ok:blob};
              
        }//load
        
        
/*

curl -X POST --data-binary @OBJECT_LOCATION \
    -H "Authorization: Bearer $(gcloud auth print-access-token)" \
    -H "Content-Type: OBJECT_CONTENT_TYPE" \
    "https://storage.googleapis.com/upload/storage/v1/b/BUCKET_NAME/o?uploadType=media&name=OBJECT_NAME"
    
*/

        obj.save    = save;
        
        async function save(token,path,blob){
        
              var i             = path.indexOf('/');
              var bucket        = path.slice(0,i);
              
              path              = path.slice(i+1);
              
              var i             = path.lastIndexOf('/');
              var filename      = path.slice(i+1);
              
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
              console.log(txt);
              
              var ok    = 'ok';
              return {ok};
        
        }//save
        
        
  //:
  
  
        function debug(){
        
              if(!df)return;
              var str   = [...arguments].join(' ');
              console.log('[ google-storage-api ]',str);
              
        }//debug
        
        
  //:
  
  
  return obj;
  
})();


