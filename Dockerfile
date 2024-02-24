FROM node:10-alpine

RUN apk update

RUN apk add tini

ENTRYPOINT ["/sbin/tini", "--"]

RUN apk add git

RUN apk update

RUN mkdir /app && chown -R node:node /app

WORKDIR /app

USER node

RUN git clone https://github.com/Twint-Studio/scratch-gui.git
RUN git clone https://github.com/Twint-Studio/scratch-vm.git

RUN cd ./scratch-vm && npm install
RUN chown -R node:node ~/.npm
RUN chmod -h 777 npm
RUN cd ./scratch-vm && npm link

RUN cd ./scratch-gui && npm install
RUN cd ./scratch-gui && npm link scratch-vm scratch-blocks

COPY --chown=node:node . .

EXPOSE 8601

CMD ["npm", "start"]
