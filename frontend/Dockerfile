FROM node:20-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Accept build argument for API URL
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# Expose port
EXPOSE 5173

# Start the preview server
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "5173"]
