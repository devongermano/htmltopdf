# Dockerfile

# Use the official Node.js image as a base
FROM node:16

# Install Google Chrome
RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the source code
COPY . .

# Build the TypeScript code
RUN npm install -D typescript && npx tsc

# Expose the port the app will run on
EXPOSE 3000

# Start the server
CMD ["node", "dist/server.js"]
