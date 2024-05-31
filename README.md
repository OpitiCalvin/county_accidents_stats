# COUNTY ACCIDENTS STATISTICS

## SETUP

### Prerequisites

1. An environment with docker and docker compose installed

### Application Setup

1. Clone the Repository

The first thing to do is to clone the repository:

```sh
$ git clone https://github.com/OpitiCalvin/County_Accident_Stats
$ cd County_Accident_Stats
```

2. Build the docker image for django

The code comes with a simple `Dockerfile` for the Django application and a `docker-compose.yaml`
for the various components of the application, including a database. Do go through them to
understand the steps involved and make changes where necessary.

To build the image, run the following command:

```sh
$ docker-compose build
```

This will pull down the python image and build an image with the Django application.

3. Run the containers

Run the following command to start the containers in detached mode:

```sh
$ docker-compose up -d
```

Since the 'web' service (Django Application) depends on the 'db' database service, a postgis image
will be pulled down and its container started, followed by that of the Django application.

While starting the django application, the following steps will be carried out:

- making of migrations
- propagation of the migrations onto the database
- starting of the django application

4. Inserting accidents and county data to the database

This step involves inserting of the application data onto the recently created database schema for the
application.
SQL dump files for this is also provided with the cloned repository. To insert the dataset onto the database, use the following commands:

- Copy the dataset onto the container, to your preferred location/directory (replace containername accordingly)
  ```sh
  $ docker cp ./accidents/data/ containername:/accident_data
  ```
- Start postgres/postgis shell

  ```sh
  $ docker exec -it <containerNameOrId> bash
  ```

- Run `psql` commands to insert the data to the database tables
  ```sh
  $ psql <databaseName> <postgresUser> -f ./accident_data/django_pg_county.sql
  $ psql <databaseName> <postgresUser> -f ./accident_data/django_pg_accident.sql
  ```

With the insert statement complete, feel free to delete the accident data dump files from the container, then exist the interactive terminal.
