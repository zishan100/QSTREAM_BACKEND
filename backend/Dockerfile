# Base Image
FROM node:22-alpine

# Create working directory
WORKDIR /backend

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy remaining project files
COPY . .

# Application port
EXPOSE 8082

# Start application
CMD ["npm","start"]