
        datatype;

        function datatype(v){
        
              var str   = Object.prototype.toString.call(v);
              str       = str.slice(8,-1);
              str       = str.toLowerCase();
              return str;
              
        }//datatype
        
        datatype.is   = {};
        
        datatype.is.node=function(v){
        
              if(v===null || typeof v!='object'){
                    return false;
              }
              if('nodeType' in v){
                    return true;
              }
              return false;
              
        }//node


