rm -rf .azle
rm -rf .dfx
rm -rf node_modules
rm .env
rm package-lock.json
rm yarn.lock
rm -rf src/app/dist
rm -rf src/declarations
dfx stop
kill $(lsof -t -i:4943)
dfx start --clean --background \
&& npm install \
&& yarn install \
&& dfx deploy internet_identity \
&& dfx generate \
&& dfx deploy