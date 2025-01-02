        function wildcard(search,pattern,mode){
                                                                                
              var re      = '';
              var esc     = '.+^${}()|[]\\';
              var n       = pattern.length;              
              for(var i=0;i<n;i++){
              
                    var c   = pattern[i];
                    
                    if(esc.indexOf(c)!=-1){
                          re   += '\\'+c;
                    }
                    else if(c=='?'){
                          re   += '.';
                    }
                    else if(c=='*'){
                          while(pattern[i+1]=='*')i++;
                          re   += '.*';
                    }
                    else if(c=='~'){
                          var c1    = pattern[i+1];
                          if(c1=='*' || c1=='?' || c1=='~'){
                                if(c1=='*' || c1=='?'){
                                      re   += '\\';
                                }
                                re   += c1;
                                i++;
                          }else{
                                re   += c;
                          }
                    }
                    else{
                          re   += c;
                    }
                    
              }//for
              
              if(!mode || mode=='starts'){
                    re    = '^'+re
              }
              if(!mode || mode=='ends'){
                    re    = re+'$';
              }              
              var regex   = new RegExp(re);
              
              var result    = regex.test(search);
              return result;
              
        }
