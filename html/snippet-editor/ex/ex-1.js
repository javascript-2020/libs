        
        
//  ipc-server-linux.c

        
        #include <sys/socket.h>
        #include <sys/un.h>
        #include <stdio.h>
        #include <unistd.h>
        #include <string.h>

        
        int main(){
          
              int sock    = socket(AF_UNIX,SOCK_STREAM,0);
              if(sock<0){
                    perror("socket");
                    return 1;
              }
              
                                                                                // remove old socket file
              unlink("/tmp/mysock");

              
              struct sockaddr_un addr;
              memset(&addr,0,sizeof(addr));
              addr.sun_family   = AF_UNIX;
              strcpy(addr.sun_path,"/tmp/mysock");
          
              if(bind(sock,(struct sockaddr*)&addr,sizeof(addr))<0){
                    perror("bind");
                    return 1;
              }          
              listen(sock,1);
              
              
              int conn    = accept(sock,NULL,NULL);
              if(conn<0){
                    perror("accept");
                    return 1;
              }
              
                                                                                //  Send a message to client
              const char *msg   = "Hello from server!";
              write(con,msg,strlen(msg));
          
                                                                                //  Read reply from client
              char buf[256];
              int n   = read(con,buf,sizeof(buf)-1);
              if(n>0){
                    buf[n]    = '\0';
                    printf("Server received: %s\n",buf);
              }
    
    
              close(conn);
              close(sock);

              
              return 0;
              
        }//main

        
