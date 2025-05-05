FROM registry.roqs.basf.net/base-images/node:latest

RUN apt-get update && apt-get install -y netcat-traditional

RUN echo "Netcat has been installed."

# Create and set app directory
WORKDIR /usr/src/app
ARG VERSION='1.0.0-Docker'

# Install app dependencies
COPY backend/. .
RUN npm version ${VERSION}

ADD frontend/mobile/dist /usr/src/app/static/mobile/

# Bundle app source
ENV NODE_EXTRA_CA_CERTS '/etc/ssl/certs/ca-certificates.crt'
ENV NODE_ENV production
ENV HTTPS_PROXY 'http://10.4.55.31:8080/'
ENV HTTP_PROXY 'http://10.4.55.31:8080/'
ENV NO_PROXY 'localhost,.basf.net'

EXPOSE 9000
ENTRYPOINT [ "sh", "start.sh" ]