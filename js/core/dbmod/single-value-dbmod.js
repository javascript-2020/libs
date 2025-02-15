

/*

//single-value-dbmod:d-

15-02-25


*/

        function dbmod(name='data',df=false){
        
          var obj   = {};
          
              var db;
              var store;
              
              obj.create    = create();
              
              function create(){
              
                    var resolve,promise   = new Promise(res=>resolve=res);
                    
                    var req               = window.indexedDB.open(name,1);
                    
                    req.onsuccess         = e=>{
                                                                                                  df && console.log('db.open.onsuccess');
                                                  db   = req.result;
                                                  resolve();
                                                  
                                            }//onsuccess
                                            
                    req.onupgradeneeded   = e=>{
                                                                                                  df && console.log('db.open.onupgradeneeded');
                                                  db          = req.result;
                                                  var store   = db.createObjectStore(name,{keyPath:'key'});
                                                  resolve();
                                                  
                                            }//onupgradeneeded
                                            
                    req.onerror           = e=>{
                                                                                                  console.log('db.open.onerror',e);
                                            }//onerror
                                            
                    return promise;
                    
              }//create
              
              
              obj.delete=function(){
              
                    var resolve,pomise    = new Promise(res=>resolve=res);
                    
                    var req               = window.indexedDB.deleteDatabase(name);
                    req.onsuccess         = e=>resolve();
                    req.onerror           = e=>console.log('delete.error');
                    
                    return promise;
                    
              }//delete
              
              
              obj.list=async function(){
              
                    var list    = await window.indexedDB.databases();
                    if(list.length==0){
                          console.log('no databases');
                    }
                    list.forEach((db,i)=>console.log(i,db.name,db.version));
                    
              }//list
              
              
              obj.put=function(data){
              
                    var resolve,promise   = new Promise(res=>resolve=res);
                    
                    var store       = db.transaction(name,'readwrite').objectStore(name);
                    var req         = store.put({key:name,data});
                    req.onerror     = e=>console.log('put error');
                    req.onsuccess   = e=>resolve();
                    
                    return promise;
                    
              }//put
              
              
              obj.get=function(){
              
                    var resolve,promise   = new Promise(res=>resolve=res);
                    
                    var store       = db.transaction(name,'readwrite').objectStore(name);
                    var req         = store.get(name);
                    req.onsuccess   = e=>resolve(req.result.data);
                    req.onerror     = e=>console.log('db.get error');
                    
                    return promise;
                    
              }//get
              
              
          return obj;
          
        }//dbmod





