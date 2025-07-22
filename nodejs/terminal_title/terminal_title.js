


          
          function terminalTitle(str){
                                                                                console.log(str);
                                                                                console.log();
                var esc   = String.fromCharCode(27);
                var c7    = String.fromCharCode(7);
                var cmd   = `${esc}]0;${str}${c7}`;
                process.stdout.write(cmd);
                
          }//terminalTitle




