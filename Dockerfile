# use official node base image
FROM node:22-alpine

# set work directory
WORKDIR /app

# copy package and package-lock json file
COPY package*.json .

# install dependencies
RUN npm install

# copy app code
COPY . .

# build npm app
RUN npm run build

# environment variables args for digital ocean build process
# ARG VITE_APP_SERVER
# ENV VITE_APP_SERVER=${VITE_APP_SERVER}

# ARG VITE_FIREBASE_KEY
# ENV VITE_FIREBASE_KEY=${VITE_FIREBASE_KEY}

# ARG VITE_FIREBASE_AUTH_DOMAIN
# ENV VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN}

# ARG VITE_FIREBASE_PROJECT_ID
# ENV VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID}

# ARG VITE_FIREBASE_STORAGE_BUCKET
# ENV VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET}

# ARG VITE_FIREBASE_MESSAGE_SENDER_ID
# ENV VITE_FIREBASE_MESSAGE_SENDER_ID=${VITE_FIREBASE_MESSAGE_SENDER_ID}

# ARG VITE_FIREBASE_APP_ID
# ENV VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID}

# expose port for vite
EXPOSE 8080

# start npm prod server
CMD [ "npm", "run", "preview" ]
