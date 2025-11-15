FROM node:22
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --silent

COPY . . 

CMD ["npm", "run", "prod"]

