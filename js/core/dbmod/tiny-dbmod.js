
        function dbmod(data,name='data'){
        
              var db,resolve,promise=()=>new Promise(res=>resolve=res)
              dbmod.create    = (data,name='data')=>{
                                      var req               = window.indexedDB.open(name,1)
                                      req.onsuccess         = e=>{db=req.result;resolve()}
                                      req.onupgradeneeded   = e=>{db=req.result;db.createObjectStore(name,{keyPath:'key'})
                                                                  data && req.transaction.objectStore(name).put({key:name,data})
                                                                  resolve()}
                                      return promise()
                                }
              dbmod.delete    = name2=>(window.indexedDB.deleteDatabase(name2||name).onsuccess=e=>resolve(),promise())
              dbmod.list      = async()=>(await window.indexedDB.databases()).forEach((db,i)=>console.log(i,':',db.name,db.version))
              dbmod.put       = data=>(db.transaction(name,'readwrite').objectStore(name).put({key:name,data}).onsuccess=e=>resolve(),promise())
              dbmod.get       = ()=>(db.transaction(name,'readwrite').objectStore(name).get(name).onsuccess=e=>resolve(e.target.result?.data),promise());
          
        }//dbmod
