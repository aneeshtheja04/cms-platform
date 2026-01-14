FROM node:20-alpine

# Install dependencies for bcrypt
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Run migrations and seed on container start
CMD ["sh", "-c", "node run-migrations.js && node run-seed.js && npm start"]
