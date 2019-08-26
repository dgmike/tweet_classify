FROM node:10.16-alpine

WORKDIR /classifier
COPY ./package.json ./package-lock.json ./
RUN npm install
COPY . .

CMD ["npm", "start"]
