

websocket server



        var wsmod     = require('wsmod');
        wsmod         = wsmod();
        
        
        var server    = require('http').createServer(request).listen(3000);
        console.log('http://localhost:3000/');
        
        server.on('upgrade',upgrade);

        
        function upgrade(req,socket,head){
        
              var con   = wsmod.upgrade.server(req,socket,onrec,onerror,onclose);

              
              console.log('ws open');
              
              con.send.text('helloworld');
              con.send.json({hello:'world'});

              var buf   = Buffer.from('helloworld');
              con.send.binary(buf);
              
              
              function onrec(payload,type,con){
              
                    console.log('ws rec',type);
                    console.log(payload.toString());
                    
              }//onrec
              
              function onerror(err,con){
              
                    console.log('ws error');
                    console.error(err);
                    
              }//onerror
              
              function onclose(con){
              
                    console.log('ws closed');
                    
              }//onclose
              
        }//upgrade
        
        
        function request(req,res){
        
              res.end('it works!');
              
        }//request
        
        
websocket client

        
        var wsmod   = require('wsmod');
        wsmod       = wsmod();
        
        var headers   = {origin:'my-origin.com'};
        var con       = await wsmod.client('wss://127.0.0.1:3000',headers,onrec,onerror,onclose);
        
        con.send.text('helloworld');
        con.send.json({hello:'world'});
        
        var buf   = Buffer.from('helloworld');
        con.send.binary(buf);
        
        
        
        function onrec(payload,type,con){
        
              console.log('ws rec',type);
              console.log(payload.toString());
              
        }//onrec
        
        
        function onerror(err,con){
        
              console.log('ws error');
              console.error(err);
              
        }//onerror
        
        function onclose(con){
        
              console.log('ws closed');
              
        }//onclose
        
        
