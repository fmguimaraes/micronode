git submodule add  https://gitlab.com/fmguimaraes/mach-two/base-service
git submodule update --init --recursive

cp /base-service/scaffold/models . && cp /base-service/scaffold/routes . && cp /base-service/scaffold/settings.js .
cd base-service && npm i && cd tus-node-server && npm i