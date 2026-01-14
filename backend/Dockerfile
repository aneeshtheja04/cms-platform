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

# Expose port
EXPOSE 3000

# Run migrations, seed, and start server
CMD ["sh", "-c", "node run-migrations.js && node run-seed.js && node src/index.js"]
