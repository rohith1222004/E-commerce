# Step 1: Specify the base image
FROM node:18

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to the container
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code to the container
COPY . .

RUN npm rebuild bcrypt --build-from-source

# Step 6: Expose the port on which the app will run (if the app runs on 3000)
EXPOSE 3000

# Step 7: Set environment variables (optional, but recommended for production)
ENV NODE_ENV=production

# Step 8: Run the application
CMD ["npm", "start"]
