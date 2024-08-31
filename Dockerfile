FROM node:20

WORKDIR /api

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

RUN npm run build

CMD ["npm", "run", "start:migrate:prod"]

