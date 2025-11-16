FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y curl git ca-certificates && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --silent

COPY . .

CMD ["npm", "run", "prod"]
