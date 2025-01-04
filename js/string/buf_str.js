        function  buf_str(buf){
        
              var byteArray     = new Uint8Array(buf);
              var n             = byteArray.length;
              var byteString    = '';
              for(var i=0;i<n;i++){
              
                  byteString   += String.fromCodePoint(byteArray[i]);
                  
              }//for
              return byteString;
