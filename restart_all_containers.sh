docker stop $(docker ps -a -q); docker rm $(docker ps -a -q)

docker run -p 4000:3002 -e "DATABASE_HOST=10.128.0.2" -d ltblueberry/db-service:demo
docker run -p 4001:3002 -e "DATABASE_HOST=10.128.0.2" -d ltblueberry/db-service:demo
docker run -p 4002:3002 -e "DATABASE_HOST=10.128.0.2" -d ltblueberry/db-service:demo
docker run -p 4003:3002 -e "DATABASE_HOST=10.128.0.2" -d ltblueberry/db-service:demo

docker run -p 5000:3001 -e "BALANCER_HOST=10.164.0.4" -d ltblueberry/api-service:demo
docker run -p 5001:3001 -e "BALANCER_HOST=10.164.0.4" -d ltblueberry/api-service:demo
docker run -p 5002:3001 -e "BALANCER_HOST=10.164.0.4" -d ltblueberry/api-service:demo
docker run -p 5003:3001 -e "BALANCER_HOST=10.164.0.4" -d ltblueberry/api-service:demo

docker run -p 6000:3000 -e "BALANCER_HOST=10.164.0.4" -d ltblueberry/web-service:demo
docker run -p 6001:3000 -e "BALANCER_HOST=10.164.0.4" -d ltblueberry/web-service:demo
docker run -p 6002:3000 -e "BALANCER_HOST=10.164.0.4" -d ltblueberry/web-service:demo
docker run -p 6003:3000 -e "BALANCER_HOST=10.164.0.4" -d ltblueberry/web-service:demo
