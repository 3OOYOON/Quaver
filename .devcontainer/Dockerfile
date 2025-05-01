FROM python:3.9

WORKDIR /usr/src/app
COPY . .

RUN apt-get update
RUN pip install --upgrade pip
RUN pip install python-dotenv
RUN pip install mysql-connector-python
RUN yes | apt-get install node.js
