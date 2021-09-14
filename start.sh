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
dfx canister create bucket
dfx build bucket
ic-cdk-optimizer target/wasm32-unknown-unknown/release/bucket.wasm -o target/wasm32-unknown-unknown/release/bucket_opt.wasm
dfx canister create ad_canister
dfx build ad_canister
ic-cdk-optimizer target/wasm32-unknown-unknown/release/ad_canister.wasm -o target/wasm32-unknown-unknown/release/ad_canister_opt.wasm
dfx deploy video_assets