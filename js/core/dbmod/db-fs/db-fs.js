

/*

//db-fs:d-

15-02-25


*/


(function db_fs_mod(df=false){

  var obj   = {
        version   : 'v1.0',
  };
  
        var df=obj.df=false,did='db-fs'
        ;
        
        
        var status    = false;
        
        
        obj.open    = function(path,flags='r'){
                                                                                            debug('open',path,flags);
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
        
              var blob    = new Blob(['db.get error']);
              var resolve,promise   = new Promise(res=>resolve=res);
              
              var store       = db.transaction(path,'readwrite').objectStore(path);
              var req         = store.get(path);
              req.onsuccess   = e=>resolve(req.result?.data);
              req.onerror     = e=>{
                                                                                console.log('db.get error',e);
                                      return blob;
                                      
                                }//onerror
                                
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
  
  
        obj.delete    = async function del(name){
                                                                                debug('delete',name);
/*
              var db    = await find(name);
              if(!db){
                                                                                debug('not fouund');
                    return false;
              }
                                                                                console.log(db);
              close(db);
*/

              var resolve,promise   = new Promise(res=>resolve=res);
              
              var req               = window.indexedDB.deleteDatabase(name);
              req.onsuccess         = e=>resolve(true);
              req.onerror           = e=>{
                                                                                debug('delete.error',e);
                                            resolve(false);
                                            
                                      }//onerror
                                      
              return promise;
              
        }//delete
        
        
        obj.list    = list;
        
        async function list(prefix,disp){
        
              var df      = obj.df||disp;
              
              prefix    ||= '';
              var names   = [];
              
              var err;
              try{
              
                    var list    = await window.indexedDB.databases();
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = err.toString();
                                                                                debug(error);
                    return {error};
              }
              
                                                                                debug('===  list databases  ===');
              if(list.length==0){
                                                                                debug('no databases');
              }
              
              list.forEach((db,i)=>{
              
                    var f   = true;
                    if(prefix && !db.name.startsWith(prefix)){
                          f   = false;
                    }
                    if(f){
                          names.push(db.name);
                    }
                                                                                debug(i,db.name,db.version);
                                                                                
              });
              
              return {names};
              
        }//list
        
        
        async function find(name){
        
              var list    = await window.indexedDB.databases();
                                                                                debug('===  list databases  ===');
              if(list.length==0){
                                                                                debug('no databases');
                    return null;
              }
              
              var n   = list.length;
              for(var i=0;i<n;i++){
              
                    var db    = list[i];
                                                                                debug(i,db.name,db.version);
                    if(db.name===name){
                          return db;
                    }
                    
              }//for
              
              return null;
              
        }//find
        
        
        obj.exists    = async function(name){
        
              var names   = await list();
              if(names.indexOf(name)==-1){
                    return false;
              }
              return true;
              
        }//exists
        
        
  //:
  
  
        function debug(...args){
        
              if(!df && !obj.df)return;
              args.unshift(`[ ${did} ]`);
              console.groupCollapsed.apply(console,args);
              console.trace();
              console.groupEnd();
              
        }//debug
        
        
  return obj;
  
//dbmod
})();








