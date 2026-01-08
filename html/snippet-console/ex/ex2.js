

        var t = 0;
        setInterval(()=>{
        
              console.clear();
              var s   = '';
              for(var y=0;y<20;y++){
              
                    for(var x=0;x<40;x++){
                    
                          var v   = Math.sin((x+t)*0.2)+Math.cos((y-t)*0.2);
                          s      += v>1 ? '#' : v>0 ? '*' : v>-1 ? '.' : ' ';
                          
                    }//for
                    s  += '\n';
                    
              }//for
              console.log(s);
              t  += 0.3;
              
        },50);
        
        