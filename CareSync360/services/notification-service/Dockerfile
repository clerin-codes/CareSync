FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --fetch-retry-mintimeout 20000 --fetch-retry-maxtimeout 120000 --fetch-retries 5

COPY . .

EXPOSE 4006

CMD ["npm", "run", "start"]
