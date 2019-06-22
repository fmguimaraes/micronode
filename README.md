This service is based on a base service made in NodeJS, Express, MongoDB, SocketIO, TusIO and is intended to be used inside a folder that respects the organization described in /scaffod folder.

## Actions
## Routes
## Models
## Upload
## Database Access
## Auth System

# Environment
```bash
sudo apt-get install nodejs npm mongodb -y

 vim ~/.bashrc
 alias python=/usr/local/bin/python3.6
 alias node=nodejs
 alias pip3=pip
```
```bash
source ~/.bashrc
* ln -s /usr/bin/nodejs /usr/bin/node 
``` 

## database
Local database configuration
```bash
mkdir data
mkdir data/db
mongo

use machtwo
db.createUser( { user: "gateKeeper",
                 pwd: "16c81a6c4ebcd09151720a4285dd74a5",
                 roles: [ { role: "clusterAdmin", db: "admin" },
                          { role: "readAnyDatabase", db: "admin" },
                          "readWrite"] },
               { w: "majority" , wtimeout: 5000 } )
```

## Using this base service

```bash
git clone YOUR-PROJECT
cd YOUR-PROJECT
git submodule add https://gitlab.com/fmguimaraes/mach-two/base-service
```
## Pre-flight
```bash
cd /home/ubuntu/dev/your application/base-service
git submodule update --init --recursive 
npm install
cd tus-node-server
npm install
```

configure settings.js to specify correct database address, user and password.

## Run
```bash
cd /home/ubuntu/dev/your application/base-service
nodemon base-service/server.js
```

```bash
1. git submodule deinit -f -- a/submodule    
2. rm -rf .git/modules/a/submodule
3. git rm -f a/submodule
```