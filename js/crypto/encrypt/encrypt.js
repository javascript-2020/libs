


/*

//encrypt:d


25-06-25


*/


function encrypt(){

  var obj   = {};
  
  
        var ext
        ;
        
        obj.initmod   = function(params){
        
              ext   = params.ext;
              
        }//initmod
        
        
  //:

  
        var aes;
  
  
        var mode              = ['crypto','aes-ctr'];

        var cryptokey         = {};
        cryptokey.derive      = {};
        encrypt.crypto        = {};        
        decrypt.crypto        = {};


  //:
  
  
        obj.init    = function(){
        
              load_libs();
              
        }//init
        
        
        async function load_libs(){
        
              var promise   = ext.load.libs('js/crypto/aes/aes.js');
              [aes]         = await promise;

              console.log('aes',aes);
              
        }//load_libs
        
        
  //:
  

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
  
  
        cryptokey.derive    = async function(password,salt){
        
              var alg           = {name:'PBKDF2'};
              var usage         = ['deriveBits','deriveKey'];
              var imported      = await window.crypto.subtle.importKey('raw',password,alg,false,usage);
              
              if(!salt){
                    salt          = window.crypto.getRandomValues(new Uint8Array(16));
              }
              var iterations    = 100_000;
              
              var alg           = {name:'PBKDF2',salt,iterations,hash:'SHA-256'};
              var derived       = {name:'AES-GCM',length:256};
              var usage         = ['encrypt','decrypt'];
              var key           = await window.crypto.subtle.deriveKey(alg,imported,derived,true,usage);
              console.log(key);
              
              return {key,salt};
        
        }//derive

        
  //:

          
        encrypt.crypto['aes-ctr']   = async function(buf,password){
        
              password          = str_buf(password);
              var {key,salt}    = await cryptokey.derive(password);
              
              var iv            = window.crypto.getRandomValues(new Uint8Array(12));
              var cipher        = await window.crypto.subtle.encrypt({name:'AES-GCM',iv},key,buf);
              cipher            = new Uint8Array(cipher);
              
              var full          = buf_gen(salt,iv,cipher);
                                                                                output('encrypt :');
                                                                                output.str('text',buf);              
                                                                                output.b64('salt',salt);              
                                                                                output.b64('iv',iv);
                                                                                output.b64('cipher',cipher);
                                                                                output.b64('full',full);              
              return full;

        }//aes-ctr
        
        
        
        decrypt.crypto['aes-ctr']   = async function(buf,password){

              password                = str_buf(password);              
              var [salt,iv,cipher]    = buf_slice(buf,16,12);
              
              var {key}               = cryptokey.derive(password,salt);
              
              var decrypted           = await window.crypto.subtle.decrypt({name:'AES-GCM',iv},key,cipher);
              
                                                                                output('decrypt :');
                                                                                output.b64('salt',salt);
                                                                                output.b64('iv',iv);
                                                                                output.b64('cipher',cipher);
                                                                                output.str('text',decrypted);
              return decrypted;              

          
        }//aes-ctr
        

  //:
  
  
        encrypt.simple    = function(text,password){
          
              aes.encrypt();
              
        }//simple


        decrypt.simple    = function(cipher,password){
          
              aes.decrypt();
              
        }//simple

        
  
  
  //:


        obj.buf_gen   = buf_gen;
        
        function buf_gen(){
        
              var len   = 0;
              [...arguments].forEach(buf=>len+=buf.byteLenth||buf.length);
              
              var full    = new Uint8Array(len);
              
              var offset    = 0;
              [...arguments].forEach(buf=>{
              
                    full.set(buf,offset);
                    offset   += buf.byteLength||buf.length;
                    
              });
              
              return full;
              
        }//buf_gen
        
        
        obj.buf_slice   = buf_slice;
        
        function buf_slice(buf){
        
              buf           = new Uint8Array(buf);
        
              var list      = [];
              var offset    = 0;
              var buf2;
              var len;
              
              var n         = arguments.length-1;
              for(var i=1;i<n;i++){
              
                    len       = arguments[i];
                    buf2      = buf.slice(offset,len);
                    offset   += len;
                    list.push(buf2);
                    
              }//for
              
              buf2    = buf.slice(offset);
              list.push(buf2);
              
              return list;
              
        }//buf_slice
        
        
        obj.to_blob   = to_blob;
        
        async function to_blob(){
          
              var type    = datatype(text);
              var buf     = text;
              switch(type){
              
                case 'string'       : buf   = encoder.encode(text);           break;
                case 'uint8array'   : buf   = text.buffer;                    break;
                case 'blob'         : buf   = await text.arrayBuffer();       break;
                
              }//switch
              
        }//to_blob
        
        
        obj.buf_str   = buf_str;
        
        function buf_str(buf){
        
              var txt   = decoder.decode(buf);
              return txt;
              
        }//buf_str
        
        
        obj.str_buf   = str_buf;
        
        function str_buf(str){
        
              var len     = str.length;
              var uint8   = new Uint8Array(len);
              [...str].forEach((c,i)=>uint8[i]    = str.charCodeAt(i));
              var buf     = uint8.buffer;
              return buf
              
        }//str_buf
        
        
        obj.buf_b64   = buf_b64;
        
        function buf_b64(buf){
        
              var bytes   = new Uint8Array(buf);
              var bin     = bytes.reduce((acc,byte)=>acc+=String.fromCharCode(byte),'');
              var b64     = btoa(bin);
              return b64;
        
        }//blob_b64
            
  
        obj.b64_buf   = b64_buf;
        
        function b64_buf(b64,type='text/plain'){
        
              var bin     = atob(b64);
              var bytes   = [...bin].map(c=>c.charCodeAt(0));
              var uint8   = new Uint8Array(bytes);
              var buf     = uint8.buffer;
              return buf;
              
        }//b64_blob


        obj.buf_blob    = buf_blob;
        
        function buf_blob(buf){
          
              var uint8   = new Uint8Array(buf);
              var blob    = new Blob([uint8]);
              return blob;
              
        }//buf_blob
        
        
        obj.blob_buf    = blob_buf;
        
        async function blob_buf(blob){
          
              var buf   = await blob.arrayBuffer();
              return buf;
          
        }//blob_buf
        
      
        obj.b64_blob    = b64_blob;
        
        function b64_blob(b64,type='text/plain'){
        
              var bin       = atob(b64);
              var bytes     = [...bin].map(c=>c.charCodeAt(0));
              var uint8     = new Uint8Array(bytes);
              var blob      = new Blob([uint8],{type});
              return blob;
              
        }//b64_blob
  
  
        obj.blob_b64    = blob_b64;
        
        async function blob_b64(blob){
        
              var buf       = await blob.arrayBuffer();
              var bytes     = new Uint8Array(buf);
              var bin       = bytes.reduce((acc,byte)=>acc+=String.fromCharCode(byte),'');
              var b64       = btoa(bin);
              return b64;
        
        }//blob_b64

  
        obj.blob_str    = blob_str;
        
        function blob_str(blob){
        }//blob_str
        
        
        obj.str_blob    = str_blob;
        
        function str_blob(str){
        }//str_blob
        


  //:
  
  
        function output(str){
        
              console.log(str);
              
        }//output
        
        
        output.b64   = function(name,buf){
        
              var b64   = buf_b64(buf);
              var pad   = name.padStart(10);
              console.log(pad,':',b64);
              
        }//b64
        
        
        output.str    = function(name,buf){

              var str;        
              if(typeof buf=='string'){
                    str   = buf;
              }else{
                    str   = buf_str(buf);
              }
              var pad   = name.padStart(10);
              console.log(pad,':',str);
              
        }//str

  
  //:
  

        obj.datatype    = datatype;
        
        function datatype(v){
        
              var str   = Object.prototype.toString.call(v);
              str       = str.slice(8,-1);
              str       = str.toLowerCase();
              return str;
              
        }//datatype




        

        
  return obj;
  
//encrypt:d-
}




