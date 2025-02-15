        function dbmod(data,name='data'){
          
              var resolve,promise=()=>new Promise(res=>resolve=res),db
              var req               = window.indexedDB.open(name,1)
              req.onsuccess         = e=>{db=req.result;resolve()}
              req.onupgradeneeded   = e=>{db=req.result;db.createObjectStore(name,{keyPath:'key'})
                                          data && req.transaction.objectStore(name).put({key:name,data})
                                          resolve()}
              obj.delete            = ()=>(window.indexedDB.deleteDatabase(name).onsuccess=e=>resolve(),promise())
              obj.list              = async()=>(await window.indexedDB.databases()).forEach((db,i)=>console.log(i,':',db.name,db.version))
              obj.put               = data=>(db.transaction(name,'readwrite').objectStore(name).put({key:name,data}).onsuccess=e=>resolve(),promise())
              obj.get               = ()=>(db.transaction(name,'readwrite').objectStore(name).get(name).onsuccess=e=>resolve(e.target.result.data),promise())
              return promise()
          
        }//dbmod
