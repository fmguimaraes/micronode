Micronode is a set of tools to easily bootstrap a (micro)service architecture. It is made with NodeJS, Express, MongoDB, SocketIO, TusIO and is intended to be used inside a folder that respects an specific organization (described in /scaffod folder). This project is not finished; proper documentation and example are needed. 

## Actions
## Routes
## Models
## Upload
## Database Access
## Auth System

# Environment
```bash
sudo apt-get install nodejs npm mongodb -y

```
```bash
source ~/.bashrc
ln -s /usr/bin/nodejs /usr/bin/node 
npm install nodemon --global
``` 


## database
Local database configuration
```bash
mkdir data
mkdir data/db
mongo

use yourDatabase
db.createUser( { user: "your-username",
                 pwd: "your-password",
                 roles: [ { role: "clusterAdmin", db: "admin" },
                          { role: "readAnyDatabase", db: "admin" },
                          "readWrite"] },
               { w: "majority" , wtimeout: 5000 } )
```

## Configuring your project to use micronode

```bash
git clone YOUR-PROJECT
cd YOUR-PROJECT
git submodule add https://github.com/fmguimaraes/micronode
```
## Pre-flight
Generate JWT tokens:
```bash
openssl genrsa -aes256 -out private_key.pem 2048
openssl rsa -pubout -in private_key.pem -out public_key.pem
```
```bash
cd /path/to/your-application
git submodule update --init --recursive 
cd micronode
npm install
cd tus-node-server
npm install
```

configure settings.js to specify correct database address, user and password.
