
      
      
      function b64_blob(b64,type='text/plain'){
      
            var bin     = atob(b64);
            var bytes   = [...bin].map(c=>c.charCodeAt(0));
            var buf     = new Uint8Array(bytes);
            var blob    = new Blob([buf],{type});
            return blob;
            
      }

      
