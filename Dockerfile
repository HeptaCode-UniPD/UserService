# Use official Node image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose port (optional for tests)
EXPOSE 3000

# Default command (can be overridden)
CMD ["npm", "test"]
