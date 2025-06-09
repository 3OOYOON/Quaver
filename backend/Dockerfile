FROM node:latest

WORKDIR /usr/src/app
COPY . .

# RUN apt-get update
# RUN apt-get install -y \
#   nodejs

# RUN apt-get update && apt-get upgrade -y && \
#     apt-get install -y nodejs \
#     npm

RUN npm install express --save
RUN npm install cors --save
RUN npm install body-parser --save
RUN npm install mysql2 --save
RUN npm install google-auth-library --save
RUN npm install bcrypt

ENV FRONTEND_PORT=5119
ENV BACKEND_PORT=5219
EXPOSE 5219

CMD ["node", "server.js"]