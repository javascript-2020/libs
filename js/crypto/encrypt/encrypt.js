


/*

//encrypt:d


25-06-25


*/


function encrypt(){

  var obj   = {};
  
  







        obj.encrypt   = encrypt;
        
        async function encrypt(text,password){
          
              var fn        = encrypt;
              mode.forEach(name=>fn=fn[name]);
              
              var cipher    = await fn(text,password);
              return cipher;
              
        }//encrypt
        
        
        obj.decrypt   = decrypt;
        
        async function decrypt(cipher,password){
          
              var fn    = decrypt;
              mode.forEach(name=>fn   = fn[name]);
              
              var text    = await fn(cipher,password);
              return text;
              
        }//decrypt

        
  //:
  
  

        
  //:
  
        encrypt.crypto    = {};        
        
        encrypt.crypto['aes-ctr']   = async function(blob,password){
                                                                                console.log('encrypt :');
              var buf           = await blob.arrayBuffer();
                                                                                output_str('text',buf);              
              password          = encoder.encode(password);

              
              var alg           = {name:'PBKDF2'};
              var usage         = ['deriveBits','deriveKey'];
              var imported      = await window.crypto.subtle.importKey('raw',password,alg,false,usage);
              
              var salt          = window.crypto.getRandomValues(new Uint8Array(16));
                                                                                output('salt',salt);
              var iv            = window.crypto.getRandomValues(new Uint8Array(12));
                                                                                output('iv',iv);
              var iterations    = 100000;
              
              var alg           = {name:'PBKDF2',salt,iterations,hash:'SHA-256'};
              var derived       = {name:'AES-GCM',length:256};
              var usage         = ['encrypt','decrypt'];
              var key           = await window.crypto.subtle.deriveKey(alg,imported,derived,true,usage);
              console.log(key);
              
              var cipher        = await window.crypto.subtle.encrypt({name:'AES-GCM',iv},key,buf);
              cipher            = new Uint8Array(cipher);
                                                                                output('cipher',cipher);
              
              var len           = salt.length+iv.length+cipher.length;
              var full          = new Uint8Array(len);
              full.set(salt,0);
              full.set(iv,salt.length);
              full.set(cipher,salt.length+iv.length);
                                                                                output('full',full);              
              var blob2         = new Blob([full]);
              return blob2;

        }//aes-ctr
        
        
        decrypt.crypto    = {};
        
        decrypt.crypto['aes-ctr']   = async function(blob,password){
                                                                                console.log('decrypt :');
              buf               = await blob.arrayBuffer();
              buf               = new Uint8Array(buf);
              
              password          = encoder.encode(password);
              
              var salt          = new Uint8Array(16);
              salt.set(buf.slice(0,16));
                                                                                output('salt',salt);
              var iv            = new Uint8Array(12);
              iv.set(buf.slice(16,28));
                                                                                output('iv',iv);
              var cipher        = new Uint8Array(buf.length-28);
              cipher.set(buf.slice(28));
                                                                                output('cipher',cipher);
              cipher            = cipher.buffer;
              
              var alg           = {name:'PBKDF2'};
              var usage         = ['deriveBits','deriveKey'];
              var imported      = await window.crypto.subtle.importKey('raw',password,alg,false,usage);
              
              var iterations    = 100000;
              
              var alg           = {name:'PBKDF2',salt,iterations,hash:'SHA-256'};
              var derived       = {name:'AES-GCM',length:256};
              var usage         = ['encrypt','decrypt'];
              var key           = await window.crypto.subtle.deriveKey(alg,imported,derived,true,usage);
              
              
              var decrypted     = await window.crypto.subtle.decrypt({name:'AES-GCM',iv},key,cipher);
                                                                                output_str('text',decrypted);
              var blob          = buf_blob(decrypted);
              return blob;
              
          
        }//aes-ctr
        

  //:
  
  
        encrypt.simple    = function(text,password){
          
              aes.encrypt();
              
        }//simple


        decrypt.simple    = function(cipher,password){
          
              aes.decrypt();
              
        }//simple

        
  
  
  //:


        async function to_blob(){
          
              var type    = datatype(text);
              var buf     = text;
              switch(type){
              
                case 'string'       : buf   = encoder.encode(text);           break;
                case 'uint8array'   : buf   = text.buffer;                    break;
                case 'blob'         : buf   = await text.arrayBuffer();       break;
                
              }//switch
              
        }//to_blob
        
        
  
        function output(name,buf){
        
              var b64   = buf_b64(buf);
              var pad   = name.padStart(10);
              console.log(pad,':',b64);
              
        }//output
        
        
        function output_str(name,buf){

              var str;        
              if(typeof buf=='string'){
                    str   = buf;
              }else{
                    str   = buf_str(buf);
              }
              var pad   = name.padStart(10);
              console.log(pad,':',str);
              
        }//output_str


        function buf_str(buf){
        
              var txt   = decoder.decode(buf);
              return txt;
              
        }//buf_str
        
        
        function buf_b64(buf){
        
              var bytes   = new Uint8Array(buf);
              var bin     = bytes.reduce((acc,byte)=>acc+=String.fromCharCode(byte),'');
              var b64     = btoa(bin);
              return b64;
        
        }//blob_b64
            
  
        function b64_buf(b64,type='text/plain'){
        
              var bin     = atob(b64);
              var bytes   = [...bin].map(c=>c.charCodeAt(0));
              var uint8   = new Uint8Array(bytes);
              var buf     = uint8.buffer;
              return buf;
              
        }//b64_blob


        function buf_blob(buf){
          
              var uint8   = new Uint8Array(buf);
              var blob    = new Blob([uint8]);
              return blob;
              
        }//buf_blob
        
        
        async function blob_buf(blob){
          
              var buf   = await blob.arrayBuffer();
              return buf;
          
        }//blob_buf
        
      
        function b64_blob(b64,type='text/plain'){
        
              var bin       = atob(b64);
              var bytes     = [...bin].map(c=>c.charCodeAt(0));
              var uint8     = new Uint8Array(bytes);
              var blob      = new Blob([uint8],{type});
              return blob;
              
        }//b64_blob
  
  
        async function blob_b64(blob){
        
              var buf       = await blob.arrayBuffer();
              var bytes     = new Uint8Array(buf);
              var bin       = bytes.reduce((acc,byte)=>acc+=String.fromCharCode(byte),'');
              var b64       = btoa(bin);
              return b64;
        
        }//blob_b64

  
        function blob_str(blob){
        }//blob_str
        
        
        function str_blob(str){
        }//str_blob
        
        

        function datatype(v){
        
              var str   = Object.prototype.toString.call(v);
              str       = str.slice(8,-1);
              str       = str.toLowerCase();
              return str;
              
        }//datatype




        

        
  return obj;
  
//encrypt:d-
}




