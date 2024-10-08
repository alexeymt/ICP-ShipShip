rm -rf .azle && rm -rf .dfx && rm -rf node_modules && rm yarn.lock && rm -rf src/app/dist && rm -rf src/declarations && rm -rf ./target/
dfx stop
kill $(lsof -t -i:4943)

# start dfx
dfx start --clean --background

yarn install

dfx identity new minter
dfx identity use minter && MINT_ACC=$(dfx ledger account-id --identity minter) && export MINT_ACC && echo $MINT_ACC

dfx identity use default && LEDGER_ACC=$(dfx ledger account-id) && export LEDGER_ACC && echo $LEDGER_ACC

ARCHIVE_CONTROLLER=$(dfx identity get-principal) && export ARCHIVE_CONTROLLER && echo $ARCHIVE_CONTROLLER

echo $MINT_ACC && echo $LEDGER_ACC && echo $ARCHIVE_CONTROLLER

export TOKEN_NAME="ICP" && export TOKEN_SYMBOL="ICP" && echo $TOKEN_NAME && echo $TOKEN_SYMBOL

dfx deploy icp_ledger_canister --argument "(variant {Init =record {minting_account = \"${MINT_ACC}\";
initial_values = vec { record {  \"${LEDGER_ACC}\";
record { e8s=100_000_000_000 } } } ; archive_options = opt record {num_blocks_to_archive = 1000000; trigger_threshold = 1000000; \
  controller_id = principal  \"${ARCHIVE_CONTROLLER}\"; }; send_whitelist = vec {}}})"

dfx identity new shipship
dfx identity use shipship && BENEFICIARY=$(dfx identity get-principal) && export BENEFICIARY && echo $BENEFICIARY

dfx deploy internet_identity
dfx generate
dfx deploy dip721_nft_container --argument "(record {name = \"Ship-Ship Rings\";logo=null;symbol=\"SSRNG\";custodians = opt vec { principal \"f7dpy-iem7z-bj6yb-om4lr-gwwm3-g4bhi-vjs64-q6rtd-q4yg2-sapnr-kae\" };})"

dfx deploy wedding # --argument "(record {beneficiary = \"$BENEFICIARY\"})"
dfx deploy app
