
# dockerfile

# docker build . -f nodejs-min.dockerfile -t nodejs-min
# docker run -di -p 4000:4000 -p 22:22 --name nodejs-min nodejs-min


FROM node:22

ARG password=node
ARG ssh=2222


RUN apt update && apt install -y openssh-server
RUN mkdir /var/run/sshd

# Set root password for SSH access (change 'node' to your desired password)
RUN echo "root:${password}" | chpasswd

RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed -i "s/#Port 22/Port ${ssh}/" /etc/ssh/sshd_config
EXPOSE $ssh


RUN mkdir /work
# COPY . /work
WORKDIR /work/


RUN printf  "%s\n" \
"#!/bin/bash" \
"set -e" \
"whoami" \
"echo" \
"echo 'starting ssh'" \
"service ssh start" \
"echo" \
"echo" \
"/bin/bash" \
 > 'start-up.sh'
 
CMD ["bash","start-up.sh"]

