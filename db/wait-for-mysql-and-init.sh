#!/bin/sh

set -e

echo "Debug: Starting MySQL connection check..."
echo "Debug: DB_HOST=$DB_HOST"
echo "Debug: DB_USERNAME=$DB_USERNAME"
echo "Debug: DB_INIT_DATABASE=$DB_INIT_DATABASE"

if [ -z "$DB_HOST" ]; then
    echo "Error: DB_HOST is not set"
    exit 1
fi

MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    echo "Debug: Attempting to connect to MySQL at $DB_HOST (attempt $((RETRY_COUNT + 1))/$MAX_RETRIES)"
    
    if mysql -h "$DB_HOST" -u"$DB_USERNAME" -p"$DB_PASSWORD" --protocol=tcp --connect-timeout=10 --default-auth=mysql_native_password -e "SELECT 1;" &> /dev/null; then
        echo "Success: MySQL is up and running!"
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT+1))
    echo "Debug: MySQL is unavailable - sleeping (attempt $RETRY_COUNT/$MAX_RETRIES)"
    sleep 3
    
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        echo "Error: Could not connect to MySQL after $MAX_RETRIES attempts"
        exit 1
    fi
done

echo "Debug: Starting database initialization..."
mysql -h "$DB_HOST" -u"$DB_USERNAME" -p"$DB_PASSWORD" --protocol=tcp --connect-timeout=10 --default-auth=mysql_native_password "$DB_INIT_DATABASE" < /init/bee-shoes-db-1.sql

echo "Success: Database initialization completed."
