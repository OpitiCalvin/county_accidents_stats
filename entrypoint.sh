#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "waiting for postgres..."

    while ! nc -z $PG_DB_HOST $PG_DB_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

# python manage.py flush --no-input
# python manage.py migrate

exec "$@"
