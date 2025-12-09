

      
      
                  class codesrc extends HTMLElement {
                  
                        constructor() {
                                                                                                        console.log('checkbox-one');
                              super();
                              
                              var root              = this;

                              var src   - root.getAttribute('src');
                              var err;
                              try{
                                
                                    var res   = await fetch(src);
                                    
                              }//try
                              catch(err2){
                                
                                    err   = err2;
                                    
                              }//catch
                              if(err){
                                    var error   = err.toString();
                                    root.textContent    = error;
                                    return;
                              }
                              if(!res.ok){
                                    var error   = res.status+' '+res.statusText;
                                    root.textContent    = error;
                              }
                              
                              var txt   = await res.text();
                              root.textContent    = txt;
                              
/*                             
                              setTimeout(()=>{
                              
                                    var str   = root.innerHTML.trim();
                                    if(str==''){
                                          root.innerHTML    = root.id;
                                    }
                                    
                              },50);
*/                              
                              
                        }//constructor
                        
                  }//class          
                  
                  customElements.define('code-src',codesrc);
                  
      

