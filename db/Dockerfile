FROM node:13.1

RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3002
CMD ["node", "service.js"]