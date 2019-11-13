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