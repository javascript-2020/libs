        function str_buf(byteString){
            
            var n           = byteString.length;
            var byteArray   = new Uint8Array(n);
            for(var i=0;i<n;i++){
            
                byteArray[i]    = byteString.codePointAt(i);
                
            }//for
            return byteArray;
            
        }//str_buf
