
This is the machtwo example service, based on micronode package, for more information please read base-service's [read](../README.md)(https://gitlab.com/fmguimaraes/mach-two/base-service/blob/master/README.md).

# Environment
```bash
git clone git@gitlab.com:fmguimaraes/mach-two/core.git
cd core
git submodule update --init --recursive 
npm install
cd base-service
npm install
cd tus-node-server
npm install
```

After finish the installation, you must update the setting files with correct database address, user and password.
# Development 
## Run

launch service
```javascript
cd YOUR-PROJECT-FOLDER
nodemon base-service/server.js
```

## Best Practices

submit an update to base service
```javascript
git commit -am'your message'
git push origin HEAD:master --force
```


