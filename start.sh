# Requires a cloned version of https://github.com/dfinity/internet-identity
export IDENTITY_PATH=../internet-identity

# Start dfx
dfx start --background

pushd $IDENTITY_PATH
II_ENV=development dfx deploy --no-wallet --argument '(null)'
export IDENTITY_CANISTER_ID=IDENTITY_PROVIDER\=http://localhost:8000?canisterId=$(dfx canister id internet_identity)
popd

# Update env file
echo $IDENTITY_CANISTER_ID > .env

# Start
dfx deploy