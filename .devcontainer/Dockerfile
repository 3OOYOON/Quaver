FROM node:latest

WORKDIR /usr/src/app
COPY . .

RUN apt-get update
RUN apt-get install -y python3-pip
# RUN yes | apt-get install node.js
RUN pip3 install mysql-connector-python

# EXPOSE 3000
# CMD ["python3", "./quaver_test.py"]