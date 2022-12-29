# Using Alpine to keep the images smaller
# Change to using the official NodeJS Alpine container
FROM node:alpine

# Pushing all files into image
WORKDIR /app
COPY . /app

# Install Sequel App
RUN npm install && \
    npm run build && \
    npm cache clean --force && \
    rm -rf ./src ./docs ./tests ./bin

# Expose port 3005
EXPOSE 3005

CMD PORT=3005 node dist/index.js