FROM node
FROM node/tsc
WORKDIR ./

COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force
COPY ./src ./src
COPY build.sh ./

RUN npm install
RUN npm install -g -d typescript tsc
#RUN npm install -g tsc
RUN sh ./build.sh
RUN npm run start