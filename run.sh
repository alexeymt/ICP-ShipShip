rm -rf .azle
rm -rf .dfx
rm -rf node_modules
rm .env
rm package-lock.json
rm yarn.lock
rm -rf src/app/dist
# rm -rf .yarn
# rm -rf deps
rm -rf src/declarations
npm install
yarn install
dfx generate
dfx deploy