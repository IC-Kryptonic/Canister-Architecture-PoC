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

DFX_VERSION=0.7.1 sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"

```

# Project Setup

1. Checkout and install our video_nft project:

```

git clone https://gitlab.lrz.de/tum-nft/video_nft.git

```

2. In repository **video_nft**, install the npm dependencies:

```

npm install

```

3. In repository **video_nft**, start the local dfx replica in the background:

```

dfx start --background

```

4. Open a new window and checkout the internet identity project:

```

git clone https://github.com/dfinity/internet-identity.git

```

5. In repository **internet-identity**, install the npm dependencies:

```

npm install

```

6. In repository **internet-identity**, deploy the canister:

```

II_ENV=development dfx deploy --no-wallet --argument '(null)'

```

7. In repository **internet-identity**, retrieve the local connection link to the deployed canister:

```

echo "http://localhost:8000?canisterId=$(dfx canister id internet_identity)"

```

8. In repository **video_nft**, create a .env file by copying and renaming the .env.example file and insert the internet-identity link, e.g.:

```

IDENTITY_PROVIDER=http://localhost:8000?canisterId=renrk-eyaaa-aaaaa-aaada-cai

```

9. In Repository **video_nft**, deploy the canisters:

```

dfx deploy

```

10. Access the application in your browser. Either:
a) Access the deployed frontend canister (production-like):

`http://ryjl3-tyaaa-aaaaa-aaaba-cai.localhost:8000/`
(ryjl3-tyaaa-aaaaa-aaaba-cai is your frontend canister id)

You can retrieve the canister id like this:
`dfx canister id video_assets`

b) Run a development server:
`npm start`
(will automatically open a browser tab for http://localhost:8080)

11. Stop / Restart the application

```

dfx stop

```

To restart the replica just use `dfx start` again or `dfx start --clean` to start without previously deployed canisters.

If you start with a clean dfx replica, the deployment of the internet-identity canister might fail because it tries to upgrade a (now deleted) canister. 

In that case, run `rm -rf .dfx` in the internet-identity repository and then deploy the canister.

# Troubleshooting

If you get the error `error[E0463]: can't find crate for 'core'`, following the instruction in the terminal, e.g.

```

rustup target add wasm32-unknown-unknown

cargo build --target wasm32-unknown-unknown

```

Then try to deploy again.

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
