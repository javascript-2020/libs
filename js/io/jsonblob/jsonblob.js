

//  https://jsonblob.com/api

function jsonblob(){
  
  var obj   = {};

  
        var url           = 'https://jsonblob.com/api/jsonBlob/';
        var id;
        var time          = 500;
        var timer;
        var headers       = {'content-type':'application/json'};
        
        var util          = {};
        util.query        = {};
        obj.util          = {};
        
        
        
  //:

  
        obj.util.query    = async function(){
        
              var tst     = window.location.search.slice(1);
              if(!tst){
                    {};
              }
              
              var {json,error}    = await read(tst);
              if(error){
                    return {error};
              }
              
              id          = tst;
              return {json};
              
        }//query

        
        obj.util.query.set    = function(){return util.query.set()}
        
        util.query.set    = function(){
        
              var url       = window.location.toString();
              var search    = window.location.search;
              if(search){
                    url     = url.slice(0,-search.length);
              }
              if(id){
                    url    += '?'+id;
              }
              window.history.replaceState(null,'',url);
              
        }//set

        
        obj.util.save   = function(json,set=true){return util.save(json,set=true)}
        
        util.save   = async function(json,set=true){
        
              if(id){
                    await update(id,json);
              }else{
                    await create(json);
              }
              
              if(set){
                    util.query.set();
              }
              
        }//save

        
        obj.util.save.debounce    = function(fn){
        
              clearTimeout(timer);
              var json    = fn();
              timer       = setTimeout(util.save,time,json);
              
        }//debounce

        
        obj.util.delete   = async function(set=true){
        
              if(id){
                    var {ok,error}    = await del(id);
                    if(ok){
                          id    = null;
                    }
              }
              
              if(!set)return;
              util.query.set();
              
        }//delete

        
  //:

  
        obj.create    = function(json){return create(json)}
        
        async function create(json){
        
              var body    = JSON.stringify(json);
              
              var err;
              try{
                
                    var res     = await fetch(url,{method:'post',headers,body});
                    
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
              
              var loc     = res.headers.get('location');
              var i       = loc.lastIndexOf('/');
              id          = loc.slice(i+1);
              
              return {id};
              
        }//create

        
        obj.read    = function(id){return read(id)}
        
        async function read(id){
        
              var err;
              try{
                
                    var res     = await fetch(url+id);
                    
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
              return {json};
              
        }//read

        
        obj.update    = async function(id,json){return update(id,json)}
        
        async function update(id,json){
        
              var body    = JSON.stringify(json);
              
              var err;
              try{
                
                    var res     = await fetch(url+id,{method:'put',headers,body});
                    
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
              
              var ok    = res.ok;
              return {ok};
              
        }//update

        
        obj.delete    = function(id){return del(id)}
        
        async function del(id){
        
              var err;
              try{
                
                    var res   = await fetch(url+id,{method:'delete'});
                    
              }//try
              catch(err2){
                
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = err.toString();
                    return {error};
              }
              
              var ok    = res.ok;
              return {ok};
              
        }//delete



  //:
  
  
  return obj;
  
}//jsonblob
