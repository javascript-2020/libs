
      
      async function blob_b64(blob){
      
            var buf     = await blob.arrayBuffer();
            var bytes   = new Uint8Array(buf);
            var bin     = bytes.reduce((acc,byte)=>acc+=String.fromCharCode(byte),'');
            var b64     = btoa(bin);
            return b64;
      
      }//blob_b64



