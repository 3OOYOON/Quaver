FROM ubuntu:latest

WORKDIR /usr/src/app
COPY . .

RUN apt-get update
RUN yes | apt-get install node.js

EXPOSE 3000
CMD ["node", "./app.js"]