# Set-up
Instal Rust
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
Start the local replica:
```
dfx start
```
Open a new window and install npm dependencies:
```
npm install
```
Deploy the canister:
```
dfx deploy
```
If you get the error `error[E0463]: can't find crate for 'core'`, following the instruction in the terminal, e.g.
```
rustup target add wasm32-unknown-unknown
cargo build --target wasm32-unknown-unknown
```
Then try to deploy again.

Open the front-end canister in your brower, for example: `http://ryjl3-tyaaa-aaaaa-aaaba-cai.localhost:8000/`.

To stop the replica use Control-C in the replica terminal window and then
```
dfx stop
```
To restart the replica just use `dfx start` again or `dfx start --clean` to start without previously deployed canisters.

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
