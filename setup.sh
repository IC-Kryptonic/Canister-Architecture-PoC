# Requires a cloned version of https://github.com/dfinity/internet-identity
export IDENTITY_PATH=../internet-identity

# # Clone identity
pushd ..
git clone https://github.com/dfinity/internet-identity
popd

# Install rust
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh

#Install wasm
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        #Update
        sudo apt-get update

        #Install CMake
        sudo apt-get install cmake

        #Install Node
        sudo apt-get install node.js

        #Install OpenSSL
        sudo apt-get install openssl
elif [[ "$OSTYPE" == "darwin"* ]]; then
        #Update
        brew update

        #Install CMake
        brew install cmake

        #Install Node
        brew apt-get install node.js

        #Install OpenSSL
        brew apt-get install openssl
else
        echo "Unknown OS"
        exit
fi




#Install DFINITY sdk
DFX_VERSION=0.8.1 sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"

#Update installed
source ~/.bashrc

#Install additional rust dependencies
cargo install ic-cdk-optimizer
rustup target add wasm32-unknown-unknown