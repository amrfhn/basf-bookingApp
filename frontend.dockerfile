FROM registry.roqs.basf.net/base-images/nginx:latest

ARG NGINX_CONF=prod

ADD frontend/.nginx/${NGINX_CONF}.conf /etc/nginx/nginx.conf

ADD frontend/web/dist /usr/share/nginx/html/future_of_work/