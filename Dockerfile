FROM node:lts-alpine

RUN apk add git

RUN apk update

RUN mkdir /app

WORKDIR /app

USER node

RUN git clone https://github.com/Twint-Studio/scratch-gui.git
RUN git clone https://github.com/Twint-Studio/scratch-vm.git

RUN cd ./scratch-vm && npm install
RUN cd ./scratch-vm && npm link

RUN cd ./scratch-gui && npm install
RUN cd ./scratch-gui && npm link scratch-vm scratch-blocks

EXPOSE 8601

CMD ["npm", "start"]
