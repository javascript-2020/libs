
function dbmod(dname='files',clear_flag=false){

  var obj   = {};
    
        var db;
          
        init();
        
        
        function init(){
                                                                                console.log('db.init');
              var resolve,promise=new Promise(res=>resolve=res);
              
              try{
              
                    var request   = window.indexedDB.open(dbname,1);
                    
              }
              catch(err2){
              
                    var err   = err2;
                    
              }
              if(err){
                                                                                console.log(err);
                    return {err};
              }
              
              request.onsuccess=function(e){
                                                                                console.log('ok');
                    db    = request.result;
                    
                    if(clear_flag){
                          clear();
                    }
                    
                    resolve({});
                    
              }//onsuccess
              
              request.onupgradeneeded=function(e){
                                                                                console.log('onupgradeneeded');
                    db          = request.result;
                    
                    var store   = db.createObjectStore(dbname,{keyPath:'name'});
                    
                    store.createIndex('name','name',{unique:true});
                    store.createIndex('desc','desc',{unique:false});
                    store.createIndex('file','file',{unique:false});
                    store.createIndex('type','type',{unique:false});
                    
                    store.transaction.oncompleted=function(e){
                                                                                console.log('Object store "files" created');
                          resolve({});
                          
                    }//oncompleted
                    
              }//onupgradeneeded
              
              request.onerror=function(e){
                                                                                console.error(`IndexedDB error: ${request.errorCode}\n${e}`);
                    resolve({err:e});
                    
              }//onerror
              
              return promise;
              
        }//init
        
        
        obj.all=function(){return all()}
        
        function all(){
        
              var resolve,promise=new Promise(res=>resolve=res);
              
              var request   = db.transaction(dbname).objectStore(dbname).getAll();
              
              request.onsuccess=function(){
              
                    var files   = request.result;
                    var list    = [];
                                                                                //console.log(files);
                    files.forEach(file=>{
                    
                          var f   = {};
                          f.name    = file.name;
                          f.desc    = file.desc;
                          list.push(f);
                          
                    });
                    
                    resolve({list});
                    
              }//onsuccess
              
              request.onerror=function(e){
                                                                                console.error(`Error to get all files: ${e}`);
                    resolve({err:e});
                    
              }//request
              
              return promise;
              
        }//all
        
        
        obj.read=function(name){return read(name)}
        
        function read(name){
        
              var resolve,promise=new Promise(res=>resolve=res);
              
              var request   = db.transaction(dbname).objectStore(dbname).get(name);
              
              request.onsuccess=function(){
              
                    var file    = request.result;
                                                                                console.log(file);
                    resolve({file});
                    
              }//onsuccess
              
              request.onerror=function(e){
                                                                                console.error(`Error to get file:${name} information: ${e}`);
                    resolve({err:e});
                    
              }//onerror
              
              return promise;
              
        }//read
        
        
        obj.write=function(name,file,desc,type){return write(name,file,desc,type)}
        
        function write(name,file,desc='',type='txt'){
                                                                                console.log(file);
              var resolve,promise=new Promise(res=>resolve=res);
              
              var file      = {name,file,desc,type};
              var request   = db.transaction(dbname,'readwrite').objectStore(dbname).put(file);
              
              request.onsuccess=function(){
                                                                                console.log(`New file added, name: ${request.result}`);
                    resolve({});
                    
              }//onsuccess
              
              request.onerror=function(e){
                                                                                console.error(`Error to add new file: ${e}`);
                    resolve({err:e});
                    
              }//onsuccess
              
              return promise;
              
        }//write
        
        
        obj.remove=function(name){return remove(name)}
        
        function remove(name){
        
              var resolve,promise=new Promise(res=>resolve=res);
              
              var request   = db.transaction(dbname,'readwrite').objectStore(dbname).delete(name);
              
              request.onsuccess=function(){
                                                                                console.log(`files deleted, name: ${request.result}`);
                    resolve({});
                    
              }//onsuccess
              
              request.onerror=function(e){
                                                                                console.error(`Error to delete file: ${e}`);
                    resolve({err:e});
                    
              }//onerror
              
              return promise;
              
        }//remove
        
        
        obj.clear=function(){return clear()}
        
        function clear(){
        
              var resolve,promise=new Promise(res=>resolve=res);
              
              var request   = db.transaction(dbname,'readwrite').objectStore(dbname).clear();
              
              request.onsuccess=function(){
                                                                                console.log(`files : ${request.result}`);
                    resolve({});
                    
              }//onsuccess
              
              request.onerror=function(e){
                                                                                console.error(`Error to clear files: ${e}`);
                    resolve({err:e});
                    
              }//onerror
              
              return promise;
              
        }//clear
        
        
        obj.delete=function(){return deletedb()}
        
        function deletedb(){
        
              var resolve,promise=new Promise(res=>resolve=res);
              
              var request   = window.indexedDB.deleteDatabase(dbname);
              
              request.onsuccess=function(e){
                                                                                console.log(e.result); // should be undefined
                    resolve({});
                    
              }//onsuccess
              
              request.onerror=function(e){
                                                                                console.log(e);
                    resolve({err:e});
                    
              }//onerror
              
        }//delete
          
          
          
  return obj;
  
}//dbmod
