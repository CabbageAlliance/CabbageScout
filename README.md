# CabbageScout

---

## WARNING - CabbageScout v1 is deprecated.

Support will not be provided. Use at your own risk.

---

[![LICENSE](https://img.shields.io/github/license/CabbageAlliance/CabbageScout?&style=flat)](https://github.com/CabbageAlliance/CabbageScout/blob/master/LICENSE)
[![Discord](https://img.shields.io/discord/676130006124068878?color=%237289DA&logo=discord)](https://discord.gg/dcrVQmQ)

[![API CI](https://github.com/CabbageAlliance/CabbageScout/workflows/API%20CI/badge.svg)](https://github.com/CabbageAlliance/CabbageScout/actions?query=workflow%3A%API+CI%22)
[![made-with-python](https://img.shields.io/badge/made%20with-Python-1f425f.svg?logo=python)](https://www.python.org/)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

[![Client CI](https://github.com/CabbageAlliance/CabbageScout/workflows/Client%20CI/badge.svg)](https://github.com/CabbageAlliance/CabbageScout/actions?query=workflow%3A%22Client+CI%22)
[![made with Next.js](https://img.shields.io/badge/made%20with-Next.js-000?logo=Next.js)](https://nextjs.org/)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)

## Running

Running CabbageScout is easy and completely free, all you need is a computer to run it on.
Everything is configured through a few configuration files and is run through [Docker](https://www.docker.com/).
[Docker](https://www.docker.com/) is a system that allows CabbageScout to run with very minimal configuration for you.

### Installing Docker

Docker provides several sets of instructions for installing it on any operating system [here](https://docs.docker.com/get-docker/).

#### Quick links

- [Linux](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
- [Windows](https://docs.docker.com/docker-for-windows/install/)
- [Mac](https://docs.docker.com/docker-for-mac/install/)

#### Docker Compose

Docker Compose is a tool used to connect several Docker containers together.

You can [install Docker Compose for free here](https://docs.docker.com/compose/install/).

### Enviroment variables

After you install Docker there are a few files you need to edit to get CabbageScout ready to run.

- `database.example.env`
- `api/api.example.env`
- `client/client.example.env`

#### `database.example.env`

1. Rename the file to `database.env`
2. Change the `POSTGRES_PASSWORD` line to have a secure password (you can ignore the other 2 lines)

```diff
# Name of the database to use
POSTGRES_DB=cabbage-scout-2020
# Username to login with
POSTGRES_USER=cabbage-scout-admin
# Password to login with
-POSTGRES_PASSWORD=YOUR_PASSWORD_HERE
+POSTGRES_PASSWORD=my_password
```

##### Advanced use:

If you change any of the other information, like the database name or user make sure to update the URI in the `api.example.env` file.

#### `api.example.env`

1. Rename the file to `api.env`
2. Change the `POSTGRES_URI` line to have the updated password you entered in the previous section for the database

```diff
# URI to use to connect to the database
# If you change the
#   - username
#   - password
#   - port
#   - database name
# make sure to update this
-POSTGRES_URI=postgresql://cabbage-scout-admin:YOUR_PASSWORD_GOES_HERE@database:5432/cabbage-scout-2020
+POSTGRES_URI=postgresql://cabbage-scout-admin:my_password@database:5432/cabbage-scout-2020
```

#### `client.example.env`

1. Rename the file to `client.env`
2. Change the `URL` line to have the URL where CabbageScout will be running (you can ignore the other line)

```diff
# The URL of the instance
-URL=https://cbg.zws.im
+URL=https://scout.example.com
# Used to see what version you are on in the settings page
COMMIT_REF=Docker v1.0.0
```

### Running the service

After you have installed Docker and setup the environment variables you can easily run the service with the following command:

```sh
docker-compose up --build -d --remove-orphans
```

Run this command inside the CabbageScout folder you downloaded or cloned with Git.

### Advanced use

#### Ports

The Docker Compose stack is setup to expose a few ports:

- `8080` - Traefik load balancer and reverse proxy dashboard
- `80` - HTTP port for the service
- `443` - HTTPS port for the service (note that you will have to provide an HTTPS certificate, [Traefik docs](https://docs.traefik.io/https/overview/))

#### Paths

The API is accessible from the path `/api`.

#### Custom routing

If you need to perform custom routing edit the `docker-compose.yml` file.

[Relevant Traefik docs about routers](https://docs.traefik.io/routing/routers/).

#### Database configuration

If you follow the regular instructions the database user will have absolute control over the database.
You should create a user for the specific tables needed so that you are granting the minimum necessary permissions.
