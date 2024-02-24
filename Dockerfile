FROM node:lts-alpine

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

RUN cd ./scratch-vm
RUN npm install
RUN npm link

RUN cd ../scratch-gui
RUN npm install
RUN npm link scratch-vm scratch-blocks

COPY --chown=node:node . .

EXPOSE 8601

CMD ["npm", "start"]
