FROM node:16.14.0 as builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:alpine

COPY package.json .
COPY .env .

RUN npm install cross-env

COPY --from=builder ./app/dist ./dist

CMD [ "npm", "start" ]
