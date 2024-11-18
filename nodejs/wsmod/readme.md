`


        
        var server    = require('http').createServer(request).listen(3000);
        console.log('http://localhost:3000/');
        
        server.on('upgrade',upgrade);

        
        function upgrade(req,socket,head){
        
              var con   = wsmod.upgrade.server(req,socket,onrec,onerror,onclose);
              
              console.log('ws open');
              
              con.send.text('helloworld');
              con.send.json({hello:'world'});
              
              
              function onrec(payload,type,con){
              
                    console.log('ws rec');
                    console.log(payload.toString());
                    
              }//onrec
              
              function onerror(err){
              
                    console.log('ws error');
                    console.error(err);
                    
              }//onerror
              
              function onclose(){
              
                    console.log('ws closed');
                    
              }//onclose
              
        }//upgrade
        
        
        function request(req,res){
        
              res.end('it works!');
              
        }//request
        
        
        
        
        
`



