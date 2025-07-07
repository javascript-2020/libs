

/*

//single-value-dbmod:d-

15-02-25


*/


(function db_fs_mod(df=false){

  var obj   = {};
  
        obj.df=df;


        
        obj.open    = function(path,flags='r'){
        
              var resolve,promise   = new Promise(res=>resolve=res);
              
              var db;
              var req               = window.indexedDB.open(name,1);
              
              req.onsuccess         = e=>{
                                                                                            df && console.log('db.open.onsuccess',path);
                                            db   = req.result;
                                            resolve(file);
                                            
                                      }//onsuccess
                                      
              req.onupgradeneeded   = e=>{
                                                                                            df && console.log('db.open.onupgradeneeded',path);
                                            db          = req.result;
                                            var store   = db.createObjectStore(name,{keyPath:'key'});
                                            resolve(file);
                                            
                                      }//onupgradeneeded
                                      
              req.onerror           = e=>{
                                                                                            console.log('db.open.onerror',path);
                                                                                            console.error(e);
                                      }//onerror
                                      
              var file      = {};
              file.read     = ()=>read(db);
              file.write    = data=>write(db,data);
              file.delete   = ()=>del(db,name);
              file.close    = ()=>close(db);
              
              return promise;

        }//open
        
        
        function read(db){
        
              var resolve,promise   = new Promise(res=>resolve=res);
              
              var store       = db.transaction(name,'readwrite').objectStore(name);
              var req         = store.get(name);
              req.onsuccess   = e=>resolve(req.result.data);
              req.onerror     = e=>console.log('db.get error');
              
              return promise;
              
        }//read
        
  
        function write(db,data){
        
              var resolve,promise   = new Promise(res=>resolve=res);
              
              var store       = db.transaction(name,'readwrite').objectStore(name);
              var req         = store.put({key:name,data});
              req.onerror     = e=>console.log('put error');
              req.onsuccess   = e=>resolve();
              
              return promise;
              
        }//write
        
        
        function close(db){
        
              if(!db){
                    return;
              }
              db.close();
              
        }//close

        
        function del(db,name){
        
              close(db);
              
              var resolve,pomise    = new Promise(res=>resolve=res);
              
              var req               = window.indexedDB.deleteDatabase(name);
              req.onsuccess         = e=>resolve();
              req.onerror           = e=>console.log('delete.error');
              
              return promise;
              
        }//delete
        

  //:
  

        obj.del   = function del(name){
        
              var resolve,pomise    = new Promise(res=>resolve=res);
              
              var req               = window.indexedDB.deleteDatabase(name);
              req.onsuccess         = e=>resolve();
              req.onerror           = e=>console.log('delete.error');
              
              return promise;
              
        }//delete


        obj.list    = list;
        
        async function list(prefix,df){
        
              var names   = [];
              var list    = await window.indexedDB.databases();
              
              if(list.length==0){
                                                                                df && console.log('no databases');
              }
              
              list.forEach((db,i)=>{
              
                    var f   = true;
                    if(prefix && !db.name.startsWith(prefix)){
                          f   = false;
                    }
                    if(f){
                          names.push(db.name);
                    }
                                                                                df && console.log(i,db.name,db.version);
                    
              });
              
              return names;
              
        }//list


        obj.exists    = async function(name){
        
              var names   = await list();
              if(names.indexOf(name)==-1){
                    return false;
              }
              return true;
              
        }//exists
  


      
  return obj;

//dbmod
})();


        
        




