#!/bin/ash

if [ ! -f /var/log/nginx/access-deploy.log]
then
    touch /var/log/nginx/access-deploy.log
fi

if [ ! -f /var/log/nginx/error-deploy.log ]
then
    touch /var/log/nginx/error-deploy.log
fi

nginx
tail -f /var/log/nginx/access-deploy.log -f /var/log/nginx/error-deploy.log
