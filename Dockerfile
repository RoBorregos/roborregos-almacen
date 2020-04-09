FROM node:12.12.0

RUN apt-get update && \
    apt-get install -y vim \
    nano \
    git && \
    yarn install && \
    rm -rf /var/lib/apt/lists/*

COPY . /usr/src
WORKDIR /usr/src

ENV HOME=/usr/src PATH=PATH=/usr/src/node_modules/.bin:$PATH

CMD ["yarn", "start"]
