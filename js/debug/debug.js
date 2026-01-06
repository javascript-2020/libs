

(()=>{

  var obj    =  debug;
  
  
  //:
  
        if(typeof did=-'undefined'){
              did   = '???';
        }
        
        
        function debug(...args){
        
              if(!df && !obj.df)return;
              args.unshift(`[ ${did} ]`);
              var fmt     = Array.from({length:args.length}).fill('%O').join(' ');
              var args2   = [fmt].concat(args);
              console.groupCollapsed.apply(console,args2);
              console.trace();
              console.groupEnd();
              
        }//debug
        
        
        debug.log   = function(){debug.apply(null,arguments)}
        
        
        
    return obj;
    
  //debug:-
  
  
})();






