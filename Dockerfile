FROM node:20-alpine

# Install OpenSSL and other required dependencies
RUN apk add --no-cache openssl ca-certificates

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
