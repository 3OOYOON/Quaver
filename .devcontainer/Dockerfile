FROM node:latest

WORKDIR /usr/src/app
COPY . .

RUN apt-get update
# RUN pip install --upgrade pip
# RUN pip install python-dotenv
# RUN pip install mysql-connector-python
# RUN yes | apt-get install node.js
# RUN pip install nvm
# RUN yes | apt-get install npm
RUN npm install mysql2
RUN npm install google-auth-library --save

