FROM node:latest

ENTRYPOINT ["npm", "start"]
CMD []

RUN apt-get update; apt-get install build-essential -y

USER node

COPY --chown=node ./ /home/node/app

WORKDIR /home/node/app

RUN npm install

WORKDIR /home/node/app
