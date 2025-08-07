


/*

//encrypt.js:d


25-06-25


*/


function encrypt(){

  var obj   = {};
  
        var df    = true;
        
  
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


        var encoder           = new TextEncoder();
        obj.encoder           = encoder;
        var decoder           = new TextDecoder();
        obj.decoder           = decoder;


  //:
  
  
        obj.init    = function(){
        
              libs();
              
        }//init
        
        
        async function libs(){
        
              var promise   = ext.load.libs('js/crypto/aes/aes.js');
              [aes]         = await promise;

        }//libs
        
        
  //:
  

        function alg(fn,type){
        
              var mode              = ['crypto','aes-gcm'];
              
              switch(type){
              
                case 'simple'   : break;
                
              }//switch
              
              mode.forEach(name=>fn=fn[name]);
              return fn;
              
        }//alg
        
        
        alg.encrypt   = function(type){
        
              var fn    = alg(encrypt,type);
              return fn;
        
        }//alg
        
        
        alg.decrypt   = function(type){
        
              var fn    = alg(decrypt,type);
              return fn;
              
        }//decrypt
        
        
  //:
  
  
        obj.encrypt   = encrypt;
        
        async function encrypt(key,buf,type){
          
              var fn        = alg(type);
              var cipher    = await fn(key,buf);
              return cipher;
              
        }//encrypt
        
        
        encrypt.password    = async function(password,buf){
        
              var fn        = alg(type);
              var cipher    = await fn.password(password,buf);
              return cipher;
              
        }//password


        
        obj.decrypt   = decrypt;
        
        async function decrypt(key,buf){
          
              var fn      = alg.decrypt(type);
              var text    = await fn(key,buf);
              return text;
              
        }//decrypt
        
        
        decrypt.password    = async function(password,buf){
        
              var fn    = alg.decrypt(type);
              var txt   = await fn.password(password,buf);
              return txt;
              
        }//password
        

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

          
        encrypt.crypto['aes-gcm']   = async function(key,buf){
        
              
              var iv            = window.crypto.getRandomValues(new Uint8Array(12));
              var cipher        = await window.crypto.subtle.encrypt({name:'AES-GCM',iv},key,buf);
              cipher            = new Uint8Array(cipher);
              
              var full          = buf_gen(iv,cipher);
                                                                                output('encrypt :');
                                                                                output.str('text',buf);              
                                                                                output.b64('salt',salt);              
                                                                                output.b64('iv',iv);
                                                                                output.b64('cipher',cipher);
                                                                                output.b64('full',full);              
              return full;

        }//aes-gcm
        
        
        encrypt.crypto['aes-gcm'].password    = async function(password,buf){
        
              password          = str_buf(password);
              var {key,salt}    = await cryptokey.derive(password);
              
              var buf           = await encrypt.crypto['aes-gcm'](key,buf);
              
              buf               = salt_buf(salt,buf);
              return buf;
              
        }//password
        
        
        
        decrypt.crypto['aes-gcm']   = async function(key,buf){


              var [iv,cipher]   = buf_slice(buf,12);
              
              var decrypted     = await window.crypto.subtle.decrypt({name:'AES-GCM',iv},key,cipher);
              
                                                                                output('decrypt :');
                                                                                output.b64('salt',salt);
                                                                                output.b64('iv',iv);
                                                                                output.b64('cipher',cipher);
                                                                                output.str('text',decrypted);
              return decrypted;              

          
        }//aes-gcm
        
        
        decrypt.crypto['aes-gcm'].password    = async function(password,buf){
        
              if(typeof password=='string'){
                    password          = str_buf(password);
              }
              var [salt,buf]    = buf_slice(buf,16);
              
              var {key}         = await cryptokey.derive(paswsord,salt);
              
              var buf           = await decrypt.crypto['aes-gcm'](key,buf);
              return buf;
              
        }//password
        

  //:
  
  
        encrypt.simple    = function(text,password){
          
              aes.encrypt();
              
        }//simple


        decrypt.simple    = function(cipher,password){
          
              aes.decrypt();
              
        }//simple

        
  //:


        function salt_buf(salt,buf){
        
              var full    = buf_gen(salt,buf);
              return full;


/*

  //nb: Salted__
  
              var len     = salt.length+buf.length;
              var full    = new Uint8Array(len);
              full.set(0,salt);
              full.set(salt.length,buf);
              return full;
*/              
        
        }//salt_buf
        
        
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
              
              var n         = arguments.length;
              for(var i=1;i<n;i++){
              
                    len       = arguments[i];
                    buf2      = buf.slice(offset,offset+len);
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


  //:
  

        function debug(){
        
              if(!df)return;
              var str   = [...arguments].join(' ');
              console.log('[ encrypt.js ]',str);
              
        }//debug

        
  return obj;
  
//encrypt.js:d-
}




