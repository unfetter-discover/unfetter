echo "api-config"
docker run -it -v unfetter_api-config:/data -v /tmp/backup/:/backup alpine tar -xvf /backup/api-config.tar -C /data/ .
echo "socket-config"
docker run -it -v unfetter_socket-config:/data -v /tmp/backup/:/backup alpine tar -xvf /backup/socket-config.tar -C /data/ .
echo "data-db"
docker run -it -v unfetter_data-db:/data -v /tmp/backup/:/backup alpine tar -xvf /backup/data-db.tar -C /data/ .
echo "certs"
docker run -it -v unfetter_certs:/data -v /tmp/backup:/backup alpine tar -xvf /backup/cert.tar -C /data/ .
