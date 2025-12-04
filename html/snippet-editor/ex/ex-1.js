

//  ipc-client-linux.node.js


        var net         = require('net');
        var PIPE_PATH   = '/tmp/mysock';
        
        
        var client      = net.createConnection(PIPE_PATH,()=>{
                                                                                console.log('Connected to server');
              client.write('hello from client');
              
        });
        
        client.on('data',data=>{
                                                                                console.log('Received from server:',data.toString());
        });
                                                                                        
        client.on('end',()=>{
                                                                                console.log('Disconnected from server');
        });
        
        client.on('error',err=>{
                                                                                console.error('Socket error:',err.message);
        });


