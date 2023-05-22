# Use a base Node.js image with version 16
FROM node:16

# Set the working directory in the container
WORKDIR /

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Install project dependencies
RUN npm install


# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which the application will run
EXPOSE 3001

# Start the application
CMD [ "npm", "start" ]