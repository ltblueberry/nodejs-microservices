# NodeJS microservices
It is an example with three simple NodeJS applications that uses one another.

* **db** service - serivce that works with database host
* **api** service - simple API that works with **db** service
* **web** service - simple web pages that send requests to **api** service

# Dependencies
* NodeJS
* npm in package.json 
* MongoDB host

# Env variables
Microservices use next env variables.

**db**:
* DATABASE_HOST - MongoDB host address (default 127.0.0.1)
* DATABASE_PORT - MongoDB port (default 27017)

**api**:
* DB_SERVICE_HOST - db service host address (default 127.0.0.1)
* DB_SERVICE_PORT - db service port (default 3002)

**web**:
* DB_SERVICE_HOST - api service host address (default 127.0.0.1)
* DB_SERVICE_PORT - api service port (default 3001)


# Local
To run microservices localy just execute `npm install` and `npm start` in services directories. Also you need active MongoDB host.

# Docker images
There are Dockerfile in each microservice directory. To build images localy you can execute next command (from project root directory)
```
docker build -t db-service db/
docker build -t api-service api/
docker build -t web-service web/
```

# DockerHub
You can find images at my DockerHub
* [ltblueberry/db-service](https://hub.docker.com/repository/docker/ltblueberry/db-service)
* [ltblueberry/api-service](https://hub.docker.com/repository/docker/ltblueberry/api-service)
* [ltblueberry/web-service](https://hub.docker.com/repository/docker/ltblueberry/web-service)

# Docker usage
Create network for microservices containers
```
docker network create micro-net
```
Use **network** and **network-alias** options to connect containers.

Run mongo container
```
docker run --name=micro-mongo --network=micro-net --network-alias=db -d mongo
```
Run db microservice
```
docker run --name=micro-db --network=micro-net --network-alias=db-service -e "DATABASE_HOST=db" -d ltblueberry/db-service:1.0
```
Run api microservice
```
docker run --name=micro-api --network=micro-net --network-alias=api-service -e "DB_SERVICE_HOST=db-service" -d ltblueberry/api-service:1.0
```
Run web microservice
```
docker run --name=micro-web --network=micro-net -e "API_SERVICE_HOST=api-service" -p 3000:3000 -d ltblueberry/web-service:1.0
```

You can change **DATABASE_HOST** variable with real IP address, if you have host with MongoDB. Make sure you have firewall rules to access it.

# Application running
Checkout **3000** port for web pages:
* **<IP_address>:3000/** - index page with list of elements from database
* **<IP_address>:3000/add** - add new item to database page

**Checkout firewall rules for incoming internet traffic to 3000 port for host**.

