FROM node:latest

WORKDIR /usr/src/app
COPY . .

RUN apt-get update
RUN npm install express
RUN npm install mysql2
RUN npm install google-auth-library --save