

(function keys(){

      if(!process.stdin.isTTY)return;
      
      process.stdout.setEncoding('utf8');
      
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding('utf8');
      
      var ctrlc   = '\u0003';
      var esc     = String.fromCharCode(27);
      process.stdin.on('data',key=>{    //keypressed
      
            if(key===ctrlc || key==='q' || key===esc)process.exit();
            
      });
      
})();




