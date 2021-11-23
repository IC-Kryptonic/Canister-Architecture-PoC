# Requires a cloned version of https://github.com/dfinity/internet-identity
export IDENTITY_PATH=../internet-identity

# # Clone identity
pushd ..
git clone https://github.com/dfinity/internet-identity
popd

# Clone stoic wallet fork
pushd ..
git clone https://gitlab.lrz.de/ga92joj/stoic-wallet-kryptonic-fork.git
popd

# Install rust
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh

#Update shell
source $HOME/.cargo/env

#Install wasm
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        #Update
        sudo apt-get update

	#Install g++
	sudo apt-get isntall g++

        #Install CMake
        sudo apt-get install cmake

        #Install Node
        sudo apt-get install node.js
	sudo apt-get install npm


        #Install OpenSSL
        sudo apt-get install openssl
	sudo apt-get install pkg-config
elif [[ "$OSTYPE" == "darwin"* ]]; then
        #Update
        brew update

	#Install c++ compiler
	brew install clang

        #Install CMake
        brew install cmake

        #Install Node
        brew install node

        #Install OpenSSL
        brew install openssl
else
        echo "Unknown OS"
        exit
fi



#Update installed
source ~/.bashrc

#Install DFINITY sdk
DFX_VERSION=0.8.1 sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"


#Install additional rust dependencies
cargo install ic-cdk-optimizer
rustup target add wasm32-unknown-unknown


#Ad ddfx path
export PATH=~/bin/:$PATH
source ~/.bashrc
