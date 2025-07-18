

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
              var req               = window.indexedDB.open(path,1);
              
              req.onsuccess         = e=>{
                                                                                            debug('db.open.onsuccess',path);
                                            db   = req.result;
                                            resolve(fs);
                                            
                                      }//onsuccess
                                      
              req.onupgradeneeded   = e=>{
                                                                                            debug('db.open.onupgradeneeded',path);
                                            db          = req.result;
                                            var store   = db.createObjectStore(path,{keyPath:'key'});
                                            
                                      }//onupgradeneeded
                                      
              req.onerror           = e=>{
                                                                                            console.log('db.open.onerror',path);
                                                                                            console.error(e);
                                                                                            console.error(req.error);
                                      }//onerror

                                      
              var fs            = {};
              fs.read           = ()=>read(path,db);
              fs.write          = data=>write(path,db,data);
              fs.write.str      = str=>write.str(path,db,str);
              fs.delete         = ()=>del(path,db);
              fs.close          = ()=>close(db);

              
              return promise;

        }//open
        
        
        function read(path,db){
        
              var resolve,promise   = new Promise(res=>resolve=res);
              
              var store       = db.transaction(path,'readwrite').objectStore(path);
              var req         = store.get(path);
              req.onsuccess   = e=>resolve(req.result?.data);
              req.onerror     = e=>console.log('db.get error');
              
              return promise;
              
        }//read
        
  
        function write(path,db,data){
        
              var resolve,promise   = new Promise(res=>resolve=res);
              
              var store       = db.transaction(path,'readwrite').objectStore(path);
              var req         = store.put({key:path,data});
              req.onerror     = e=>console.log('put error');
              req.onsuccess   = e=>resolve();
              
              return promise;
              
        }//write
        
        
        write.str   = function(path,db,str){
        
              var blob      = new Blob([str]);
              var result    = write(path,db,blob);
              return result;
              
        }//str
        
        
        function close(db){
        
              if(!db){
                    return;
              }
              db.close();
              
        }//close

        
        function del(path,db){
        
              close(db);
              
              var resolve,pomise    = new Promise(res=>resolve=res);
              
              var req               = window.indexedDB.deleteDatabase(path);
              req.onsuccess         = e=>resolve();
              req.onerror           = e=>console.log('delete.error');
              
              return promise;
              
        }//delete
        

  //:
  

        obj.delete    = function del(name){
        
              var resolve,pomise    = new Promise(res=>resolve=res);
              
              var req               = window.indexedDB.deleteDatabase(name);
              req.onsuccess         = e=>resolve();
              req.onerror           = e=>console.log('delete.error');
              
              return promise;
              
        }//delete


        obj.list    = list;
        
        async function list(prefix,disp){
        
              var df      = obj.df||disp;
              
              prefix    ||= '';
              var names   = [];
              var list    = await window.indexedDB.databases();
                                                                                df && debug('===  list databases  ===');
              if(list.length==0){
                                                                                df && debug('no databases');
              }
              
              list.forEach((db,i)=>{
              
                    var f   = true;
                    if(prefix && !db.name.startsWith(prefix)){
                          f   = false;
                    }
                    if(f){
                          names.push(db.name);
                    }
                                                                                df && debug(i,db.name,db.version);
                    
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
  

  //:
  
  
        function debug(){
        
              if(!obj.df)return;
              var str   = [...arguments].join(' ');
              console.log('[ db-fs ]',str);
              
        }//debug

      
  return obj;

//dbmod
})();


        
        




