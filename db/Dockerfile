FROM alpine:latest

RUN apk add --no-cache mysql-client
WORKDIR /init

COPY bee-shoes-db-1.sql /init/bee-shoes-db-1.sql
COPY wait-for-mysql-and-init.sh /init/wait-for-mysql-and-init.sh

RUN chmod +x /init/wait-for-mysql-and-init.sh

CMD ["/init/wait-for-mysql-and-init.sh"]
