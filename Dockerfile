FROM boclipsconcourse/nginx-spa:0.23.0
COPY html /usr/share/nginx/html
COPY application.conf /etc/nginx/conf.d/application.conf
