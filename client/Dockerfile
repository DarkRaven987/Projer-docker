FROM node:10 as build

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm install --production

COPY . /usr/src/app/