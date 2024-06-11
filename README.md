# Ship Ship

## Description of Project

Ship Ship - matching and wedding ICP project.

We have 2 canisters realized:

1. wedding canister - this is an analog of the backend. This canister stores all weddings and information about each wedding. The following info: names, principals (this is Internet ID for DApp), wedding date, wedding id, current wedding status (just paired/married) There are two operations on this canister - match into a couple and agree to marry.

2. website assets canister - this is everything that is responsible for the visual part (html/css), stores images.

## Wedding canister

Wedding canister is responsible for managing partner matching and marrying.

Candid (IDL) interface for canister:

```
service: () -> {
    agreeToMarry: () -> ();
    getPartnerInfo: (principal) -> (opt record {id:principal; name:opt text; wedding:text; isAgreed:bool}) query;
    getWeddingInfoOf: (principal) -> (opt record {id:text; hadAt:nat; partner1:record {id:principal; name:opt text; wedding:text; isAgreed:bool}; partner2:record {id:principal; name:opt text; wedding:text; isAgreed:bool}}) query;
    matchPartner: (text, principal) -> ();
}
```

Canister methods description:

- `matchPartner` - this method is used to match with another partner and supply your name.
- `agreeToMarry` - agree to marry with another partner (after another partner agreed partners are considered to be married)

- `getPartnerInfo` - method returns information about specific partner like id, name, marry agree flag and wedding id
- `getWeddingInfoOf` - method returns wedding information about specific partner, if he/she is not going to marry is will be Null

Frontend will call `matchPartner` at first and `agreeToMarry` after.

## Frontend assets canister

Frontend is written in React.js and TypeScript, build system is Vite. Source code is in `src/app`.

To start an app fill the `.env` file based on `.env.example` and run `yarn start`.

Mainnet deployed NFT minter: https://mdh7i-waaaa-aaaag-qct4a-cai.icp0.io/

## Setting up for local development

To get started, start a local dfx development environment in this directory with the following steps:

```bash
# Install dfx latest version (0.15.1)
sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
dfx --version

dfx stop && dfx start --background --clean

dfx start --background --clean --host '0.0.0.0:4943'

rm -rf ./.dfx ./.azle ./.env ./src/staking/index.did ./src/declarations ./src/app/dist
rm -rf ./node_modules ./yarn.lock


curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
nvm --version
nvm install 18
node --version
corepack enable
corepack prepare yarn@3.6.3 --activate
yarn --version

yarn install

# Linux:
# sudo apt-get install build-essential pkg-config libssl-dev clang libclang-dev

# init local internet identity canister
dfx deps pull
dfx deps init --argument '(null)' internet-identity
dfx deps deploy

# dfx deploy --argument="(\"https://s2.coinmarketcap.com/static/img/coins/64x64/28230.png\", \"Big Time\", \"BIGTIME\", 6, 10000000000000000, principal \"$(dfx identity get-principal --identity=default)\", 0)" token

# deploy everything except frontend to generate declarations

dfx deploy # internally calls `npm run build` and `npm run prebuild` for app canister

```

Useful commands:

```sh
# clean code and state + test works
dfx canister delete wedding && dfx deploy # --mode=reinstall

yarn start # develop frontend
yarn build # test frontend works
dfx deploy app # test frontend works in canister
dfx deploy staking # test staking works
# (dfx generate staking)

# dfx deploy staking && dfx generate staking # generate declarations/staking/staking.did
dfx deploy staking # > dfx generate staking (doesn't generate did file for staking = but generates it in declarations/ folder)

dfx canister uninstall-code token
dfx canister uninstall-code staking # => delete (delete code + state)

dfx canister status token
dfx canister status staking

dfx canister delete token
dfx canister delete staking

dfx canister uninstall-code --all

# init whoami canister
dfx deploy


dfx deploy staking # staking - not working because .env

dfx ledger account-id

npm run start


dfx ledger account-id # ?

dfx identity get-principal --identity=rnbtest
dfx identity get-principal --identity=default


dfx canister call token balanceOf "principal \"$(dfx identity get-principal --identity=rnbtest)\""
dfx canister call token balanceOf "principal \"$(dfx identity get-principal --identity=default)\""
dfx canister call token balanceOf "principal \"$(dfx canister id staking)\""

# id ≠ canister id
dfx canister id internet-identity
dfx canister id whoami
dfx canister id staking
dfx canister id app

dfx canister id __Candid_UI

dfx canister call --identity=default token transfer "(principal \"$(dfx identity get-principal --identity=rnbtest)\", 1_000_000_000_000_000)"
dfx canister call --identity=default token approve '(principal "asrmz-lmaaa-aaaaa-qaaeq-cai", 0_500_000_000_000_000)'

dfx canister call --identity=rnbtest token transfer "(principal \"$(dfx canister id staking)\", 0_200_000_000_000_000)"

dfx canister call --identity=rnbtest staking deposit '0_100_000_000_000_000'

dfx canister call --identity=rnbtest token claim

open "http://127.0.0.1:$(dfx info replica-port)" # replica
open "http://127.0.0.1:$(dfx info webserver-port)" # ledger webserver

# candid ui
open "http://127.0.0.1:$(dfx info webserver-port)/?canisterId=$(dfx canister id __Candid_UI)&id=$(dfx canister id internet-identity)"
open "http://127.0.0.1:$(dfx info webserver-port)/?canisterId=$(dfx canister id __Candid_UI)&id=$(dfx canister id __Candid_UI)"
open "http://127.0.0.1:$(dfx info webserver-port)/?canisterId=$(dfx canister id __Candid_UI)&id=$(dfx canister id wedding)"
open "http://127.0.0.1:$(dfx info webserver-port)/?canisterId=$(dfx canister id __Candid_UI)&id=$(dfx canister id app)"

open "http://127.0.0.1:$(dfx info webserver-port)/?canisterId=$(dfx canister id internet-identity)"
open "http://127.0.0.1:$(dfx info webserver-port)/?canisterId=$(dfx canister id app)"

open "http://127.0.0.1:$(dfx info webserver-port)/?canisterId=$(dfx canister id staking)"
```

Test identity recovery phrase:

10000 shadow library write clap permit vacant beef marble never labor wolf response fury there empower dash wing few film frost verify trip chat average

Once deployed, start the development server with `npm start`.

You can now access the app at `http://127.0.0.1:5173/`.

## Pulling Internet Identity into your own project

To pull Internet Identity into your own project, you'll need to do the following:

1. Add Internet Identity to your `dfx.json` file:

```json
"internet-identity" : {
    "type": "pull",
    "id": "rdmx6-jaaaa-aaaaa-aaadq-cai"
}
```

2. Run the following commands to install the dependencies:

```bash
dfx deps pull
dfx deps init --argument '(null)' internet-identity
dfx deps deploy
```
