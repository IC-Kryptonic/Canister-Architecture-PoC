# Requires a cloned version of https://github.com/dfinity/internet-identity
export IDENTITY_PATH=../internet-identity

# # Update identity
pushd $IDENTITY_PATH
git clean -df # we assume we make no changes to internet identity repo
git checkout -- . # so we discard any changes, e.g package-lock.json
git pull
git checkout c4296058c5ac61bb50c9dd84300f5ad1ed22f5fe
npm install
popd

# Update current repository
git checkout package-lock.json
git pull
npm install

# Setup clean replica with identity
dfx stop
dfx start --background --no-artificial-delay --clean
pushd $IDENTITY_PATH
rm -r .dfx
II_ENV=development dfx deploy --no-wallet --argument '(null)'
export IDENTITY_CANISTER_ID=IDENTITY_PROVIDER\=http://localhost:8000?canisterId=$(dfx canister id internet_identity)
popd

# Update env file
echo $IDENTITY_CANISTER_ID > .env

# Deploy local canisters
dfx canister create video_canister
dfx build video_canister
ic-cdk-optimizer target/wasm32-unknown-unknown/release/video_canister.wasm -o target/wasm32-unknown-unknown/release/video_canister_opt.wasm

dfx deploy native_token
dfx deploy token_management
dfx deploy dex --argument '('\"$(dfx canister id native_token)\"')'
dfx deploy video_assets

# Seed data
cargo run --bin=seeder --release