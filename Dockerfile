FROM node:16.15.0

RUN yarn global add @nestjs/cli

WORKDIR /var/www/app

COPY package.json yarn.lock ./

RUN yarn install

EXPOSE 3000

CMD yarn run start
