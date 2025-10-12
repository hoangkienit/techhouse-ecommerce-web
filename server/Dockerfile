# Use the official Node.js LTS image
FROM node:18


# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app source code
COPY . .

# Expose port your app runs on (adjust if needed)
EXPOSE 5000

# Start the app
CMD ["npm", "start"]