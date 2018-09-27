FROM node:10.1-alpine

LABEL MAINTAINER="unfetter"
LABEL Description="Migration Container"

ENV WORKING_DIRECTORY /usr/share/app/
# Create Application Directory
#RUN mkdir -p $WORKING_DIRECTORY
WORKDIR $WORKING_DIRECTORY

COPY package.json ./

COPY *.js $WORKING_DIRECTORY
#COPY docker/set-npm-repo.sh $WORKING_DIRECTORY
#RUN chmod 700 $WORKING_DIRECTORY/*.sh
#RUN $WORKING_DIRECTORY/set-linux-repo.sh
#RUN $WORKING_DIRECTORY/set-npm-repo.sh

# Install packages
RUN npm install

# Install Dependencies
CMD [ "node ", "upgrade.js" ]
