


/*

//argv:d

18-04-25


*/


        module.exports    = argv;
        
        
        function argv(id0,def){
        
              var args    = [...arguments];
              var ids     = [...arguments].slice(0,-1);
              def         = args.at(-1);
              
              var nj    = ids.length;
              for(var j=0;j<nj;j++){
              
                    var id    = ids[j];
                    
                    var nk    = process.argv.length;
                    for(var k=0;k<nk;k++){
                    
                          switch(process.argv[k]){
                          
                            case id         :
                            case '-'+id     :
                            case '--'+id    : 
                                              var v   = process.argv[k+1];
                                              return v;
                            
                          }//switch
                          
                    }///for
                    
              }//for
              return def;
              
        }//argv
        
