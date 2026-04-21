
/*
  requires
    path,fs
*/

        resolve.df    = false;
        //resolve.df    = true
        
        function resolve(requrl,docroot='.'){
                                                                                resolve.df && console.log('=== resolve v3.0 ===');
                                                                                resolve.df && console.log('requrl ... : ',requrl);
                                                                                resolve.df && console.log('docroot .. : ',docroot);
              var err;
              try{
              
                    requrl    = decodeURI(requrl);
                    
              }//try
              catch(err2){
              
                    err   = err2;
                    
              }//catch
              if(err){
                                                                                resolve.df && console.log('error .... : ',err.message);
                    var error   = 'invalid url';
                    return {error};
              }
              
              var url   = requrl;
              
              if(url.indexOf('\\')!=-1){
                                                                                resolve.df && console.log('error .... : ','invalid url ( backslash )');
                    var error   = 'invalid url ( backslash )';
                    return {error};
              }
              
              url         = url.slice(1);
                                                                                resolve.df && console.log('url ...... : ',url);
              var root    = path.resolve(docroot);
              //root       += path.sep;
                                                                                resolve.df && console.log('root ..... : ',root);
              var abs     = path.resolve(docroot,url);
                                                                                resolve.df && console.log('abs ...... : ',abs);
                                                                                
              if(!abs.startsWith(root)){
                                                                                resolve.df && console.log('error .... : ','invalid docroot');
                    var error   = 'invalid docroot';
                    return {error};
              }
              
              if(abs.length>root.length){
                    if(abs[root.length]!=path.sep){
                                                                                resolve.df && console.log('error .... : ','invlaid docroot-2');
                          var error   = 'invalid docroot-2';
                          return {error};
                    }
              }
              
              if(requrl.endsWith('/')){
                    abs  += '/';
              }
              
              
                                                                                resolve.df && console.log('ok ....... : ',abs);
              return {abs};
              
        }//resolve
        
        
        
        
