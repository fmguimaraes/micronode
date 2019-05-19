# Environment
## Ubuntu 
The Environment is a instance Ubuntu, configured with NodeJS and MongoDB; The API is available as systemctl service in ``/etc/systemctl/system/mach-two.service`` and it is launched at startup in port 8080.

### Environment
* vim ~/.bashrc
  * alias python=/usr/local/bin/python3.6
  * alias node=nodejs
  * alias pip3=pip
* source ~/.bashrc
* ln -s /usr/bin/nodejs /usr/bin/node 

### Packages
``sudo apt-get install nodejs npm mongodb -y`` 

## Mongo
* mkdir data
* mkdir data/db
* mongo
  * use machtwo
  * db.createUser( { user: "gateKeeper",
                 pwd: "16c81a6c4ebcd09151720a4285dd74a5",
                 roles: [ { role: "clusterAdmin", db: "admin" },
                          { role: "readAnyDatabase", db: "admin" },
                          "readWrite"] },
               { w: "majority" , wtimeout: 5000 } )

## Code Deploy  
* go to /home/ubuntu/dev/application-service/ 
* npm install
* npm install --global nodemon
* npm install --global gulp-cli

## Run
* open an bash cli and run mongod (to run mongo)
* nodemon server.js