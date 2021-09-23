# Requires a cloned version of https://github.com/dfinity/internet-identity
export IDENTITY_PATH=../internet-identity

# Start dfx
dfx start --background --no-artificial-delay

pushd $IDENTITY_PATH
rm -r .dfx
II_ENV=development dfx deploy --no-wallet --argument '(null)'
export IDENTITY_CANISTER_ID=IDENTITY_PROVIDER\=http://localhost:8000?canisterId=$(dfx canister id internet_identity)
popd

# Update env file
echo $IDENTITY_CANISTER_ID > .env

# Start
dfx canister create video_canister
dfx build video_canister
ic-cdk-optimizer target/wasm32-unknown-unknown/release/video_canister.wasm -o target/wasm32-unknown-unknown/release/video_canister_opt.wasm

dfx deploy native_token
dfx deploy token_management
dfx deploy dex --argument \''('\"$(dfx canister id native_token)\"')'\'
dfx deploy video_assets