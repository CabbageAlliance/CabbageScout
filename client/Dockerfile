FROM node:13.8-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

COPY next.config.js ./
COPY public ./public
COPY src ./src
RUN yarn build

CMD ["yarn", "start"]