
/**

        https://github.com/fitzgen/glob-to-regexp/tree/master

        When globstar is _false_ (default), '/foo/*' is translated a regexp like
        '^\/foo\/.*$' which will match any string beginning with '/foo/'
        When globstar is _true_, '/foo/*' is translated to regexp like
        '^\/foo\/[^/]*$' which will match any string beginning with '/foo/' BUT
        which does not have a '/' to the right of it.
        E.g. with '/foo/*' these will match: '/foo/bar', '/foo/bar.txt' but
        these will not '/foo/bar/baz', '/foo/bar/baz.txt'
        Lastely, when globstar is _true_, '/foo/**' is equivelant to '/foo/*' when
        globstar is _false_

        globstar is enabled, so determine if this is a globstar segment

        RegExp flags (eg "i" ) to pass in to RegExp constructor.



              
*/



        function glob(glob,str,opts){

              if(typeof glob!='string'){
                    throw new TypeError('Expected a string');
              }
              
              var str         = String(glob);
              var reStr       = '';
              var extended    = opts ? !!opts.extended : false;
              var globstar    = opts ? !!opts.globstar : false;
              var inGroup     = false;
              var flags       = opts && typeof(opts.flags)=='string' ? opts.flags : '';
              
              var c;
              var len   = str.length;
              
              for(var i=0;i<len;i++){
              
                    c   = str[i];
                    
                    switch (c) {
                    
                      case '/'    :
                      case '$'    :
                      case '^'    :
                      case '+'    :
                      case '.'    :
                      case '('    :
                      case ')'    :
                      case '='    :
                      case '!'    :
                      case '|'    :
                      
                          reStr  += '\\'+c;
                          break;
                        
                      case '?'    :
                      
                          if(extended){
                                reStr  +='.';
                    	          break;
                          }
                        
                      case '['    :
                      case ']'    :
                      
                          if(extended){
                                reStr  += c;
                    	          break;
                          }
                        
                      case '{'    :
                      
                          if(extended){
                                inGroup   = true;
                    	          reStr    += '(';
                    	          break;
                          }
                        
                      case '}'    :
                      
                          if(extended){
                                inGroup   = false;
                    	          reStr    += ')';
                    	          break;
                          }
                        
                      case ','    :
                      
                          if(inGroup){
                                reStr += "|";
                    	          break;
                          }
                          reStr  += '\\'+c;
                          break;
                        
                      case '*'    :
                      
                          var prevChar    = str[i-1];
                          var starCount   = 1;
                          
                          while(str[i+1]=='*'){
                          
                                starCount++;
                                i++;
                                
                          }//while
                          
                          var nextChar    = str[i+1];
                          
                          if(!globstar){
                                reStr  += '.*';
                          }else{
                                var isGlobstar    = starCount>1 && 
                                                    (prevChar==='/' || prevChar===undefined)  &&
                                                    (nextChar==='/' || nextChar===undefined)
                                  
                                if(isGlobstar){
                                      reStr  += '((?:[^/]*(?:\/|$))*)';
                                      i++;
                                }else{
                                      reStr  += '([^/]*)';
                                }
                          }
                          break;
                        
                      default     :  reStr  += c;
                      
                    }//switch
                    
              }//for
              
              if(!flags || !~flags.indexOf('g')){
                    reStr   = '^'+reStr+'$';
              }
              
              var regex     = new RegExp(reStr,flags);
              var result    = regex.test(str);
              return result;
              
        }//glob
        







        
