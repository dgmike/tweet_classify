FROM node:10.16-alpine

RUN npm install -g yarn serve

WORKDIR /frontend
COPY ./package.json ./yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

CMD serve -s build
