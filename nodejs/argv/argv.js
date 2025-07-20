


/*

//argv:d

18-04-25


*/


        module.exports    = argv;
        
        
        function argv(id,def){
        
              var n   = process.argv.length;
              for(var i=0;i<n;i++){
              
                    switch(process.argv[i]){
                    
                      case id         :
                      case '-'+id     :
                      case '--'+id    : return process.argv[i+1];
                      
                    }//switch
                    
              }///for
              return def;
              
        }//argv
        
