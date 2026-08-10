


/*

lsmod.mjs

10-08-26


*/
                                                                                //debugger;
                                                                                var df=true,did='lsmod.mjs';
                                                                                df && console.log(`[ ${did} ]`);
                                                                                
                                                                                df && console.log(`[ ${did} ]`,'import.meta.url  :',import.meta.url);
        var url                   = new URL('./ls-mod.js',import.meta.url).href;
                                                                                df && console.log(`[ ${did} ]`,'            url  : ',url);
        var txt                   = await fetch(url).then(res=>res.text());
        var js                    = `
                                                (()=>{
                                                
                                                      var lsmod    = ${txt};
                                                      return lsmod;
                                                      
                                                })();
                                          `;
        var lsmod                 = eval(js);
        
        export {lsmod}
        
        
        
        
        
        
        
        
        