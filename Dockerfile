FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Deploy slash commands and start bot
CMD ["sh", "-c", "npm run deploy && npm start"]
