FROM node:latest

WORKDIR /usr/src/app
COPY . .

RUN apt-get update
RUN apt-get install -y curl
RUN curl --silent --location https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y \
  nodejs

RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y nodejs \
    npm

RUN npm install express
RUN npm install body-parser
RUN npm install mysql2
RUN npm install google-auth-library --save
RUN npm install bcrypt