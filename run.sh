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
&& yarn install \
&& dfx deploy internet_identity \
&& dfx generate \
&& dfx deploy dip721_nft_container --specified-id br5f7-7uaaa-aaaaa-qaaca-cai \
&& dfx deploy wedding --specified-id bw4dl-smaaa-aaaaa-qaacq-cai \
&& dfx deploy app --specified-id bkyz2-fmaaa-aaaaa-qaaaq-cai
