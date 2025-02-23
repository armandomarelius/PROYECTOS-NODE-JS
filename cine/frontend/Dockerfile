FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Add host flag to allow external connections
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]