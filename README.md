# Quick start

0. Update the IDENTITY_PATH variable in all scripts if the internet identity is not in the neighbouring directory

1. Run `bash setup.sh` once to install all the required dependencies

2. Run `bash deploy.sh` once everytime the code changes or you want a clean state

3. Use `bash start.sh` to start the network and open the frontend

4. Use `bash stop.sh` to stop the dfx network

In case of errors refer to manual project setup

# Technical prerequisites

Install Rust

```

$ curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh

```

Install wasm-pack

```

curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

```

Install CMake, for exmaple with Homebrew

```

brew install cmake

```

Install node.js, for example with Homebrew

```

brew install node

```

Install the DFINITY SDK:

```

DFX_VERSION=0.8.1 sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"

```

Install the ic-cdk-optimizer:

```

cargo install ic-cdk-optimizer

```

Add wasm32 as a target for Rust
```

rustup target add wasm32-unknown-unknown

```

Checkout our video_nft project:

```

git clone https://gitlab.lrz.de/tum-nft/video_nft.git

```

Checkout the internet identity project, preferably in a neighboring directory:


```

git clone https://github.com/dfinity/internet-identity.git

```

# Manual project Setup

1. In repository **video_nft**, install the npm dependencies:

```

npm install

```

2. In repository **video_nft**, start the local dfx replica in the background:

```

dfx start --background --no-artificial-delay

```

4. In repository **internet-identity**, install the npm dependencies:

```

npm install

```

5. In repository **internet-identity**, deploy the canister:

```

II_ENV=development dfx deploy --no-wallet --argument '(null)'

```

6. In repository **internet-identity**, retrieve the local connection link to the deployed canister:

```

echo "http://localhost:8000?canisterId=$(dfx canister id internet_identity)"

```

7. In repository **video_nft**, create a .env file by copying and renaming the .env.example file and insert the internet-identity link, e.g.:

```

IDENTITY_PROVIDER=http://localhost:8000?canisterId=renrk-eyaaa-aaaaa-aaada-cai

```

8. In Repository **video_nft**, compile the bucket code and optimize it:

```

dfx canister create bucket
dfx build bucket
ic-cdk-optimizer target/wasm32-unknown-unknown/release/bucket.wasm -o target/wasm32-unknown-unknown/release/bucket_opt.wasm

```

9. In Repository **video_nft**, deploy the backend canister:

```

dfx deploy video_backend

```

10. Stop / Restart the application

```

dfx stop

```

To restart the replica just use `dfx start` again or `dfx start --clean` to start without previously deployed canisters.

If you start with a clean dfx replica, the deployment of the internet-identity canister might fail because it tries to upgrade a (now deleted) canister. 

In that case, run `rm -rf .dfx` in the internet-identity repository and then deploy the canister.
# Troubleshooting

# Testing

To run the testing script first make sure there is no replica already running and then just execute the script:

```

dfx stop

./test.sh

```

Rust integration tests have to be run single threaded since the ic functions are not thread safe when not run in a canister.

```

cargo test -- --test-threads=1

```
