



function localstoragemod(){
  
  var obj   = {};
  
  
        
        obj.initmod   = function(){
        }//initmod
        
        
  //vars:

  
        var base    = window.location.toString();
        var i       = base.indexOf('?');
        if(i!=-1){
              base    = base.slice(0,i);
        }
        
        
        obj.write   = new Proxy({},{
          
              set(obj,prop,value){
                
                    var {str,error}   = stringify(value);
                    if(error){
                          return {error};
                    }
                    
                    var full              = `[${base}]${prop}`;
                    localStorage[full]    = str;
                    return {ok:'ok'};
                    
              }//set
              
        });
        
        
        obj.read    = new Proxy({},{
          
              get(target,prop,receiver){
                
                    var full    = `[${base}]${prop}`;
                    var str     = localStorage[full];
                    if(str===null){
                          var error   = 'not found';
                          return {error};
                    }
                    var value   = JSON.parse(str);
                    return {value};
                    
              }//get
              
        })//read
        


        function stringify(value){
          
              var err;
              try{
                
                    var str   = JSON.stringify(value);
                    
              }//try
              catch(err2){
                
                    err   = err2;
                    
              }//catch
              if(err){
                    var error   = err.toString();
                    return {error};
              }
              
              return {str};
              
        }//stringify
        
  
  //:
  
  
  return obj;
  
//localstoragemod
}


