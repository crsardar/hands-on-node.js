FROM node:10

RUN addgroup -S node && adduser -S node -G node
USER node:node

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8090
CMD [ "node", "App.js" ]