# Dockerfile adapted from
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install --silent

# Bundle app source
COPY . ./

EXPOSE 4000
CMD [ "node", "server.js" ]

# # Dockerfile adapted from
# # https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
# FROM node:16

# # Create app directory
# WORKDIR /usr/src/app

# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)
# COPY ./app/package.json ./
# COPY ./app/package-lock.json ./

# RUN npm install --silent

# # Bundle app source
# COPY ./app .

# EXPOSE 4000
# CMD [ "node", "server.js" ]