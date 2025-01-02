        
        async function sha256(message){
          
              var uint8   = new TextEncoder().encode(message);                    
              var buf     = await crypto.subtle.digest('SHA-256',uint8);
              var uint8   = new Uint8Array(buf);
              var arr     = Array.from(uint8);
              var hash    = arr.map(b=>b.toString(16).padStart(2,'0')).join('');
              return hash;
              
        }


        
