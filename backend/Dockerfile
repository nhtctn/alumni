FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json nest-cli.json webpack.config.js ./
COPY src ./src
COPY views ./views
COPY public ./public

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
