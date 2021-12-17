FROM node:16
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
EXPOSE 80
CMD [ "node", "serverfile.js" ]