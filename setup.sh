# Requires a cloned version of https://github.com/dfinity/internet-identity
export IDENTITY_PATH=../internet-identity

# # Update identity
pushd $IDENTITY_PATH
git clean -df # we assume we make no changes to internet identity repo
git checkout -- . # so we discard any changes, e.g package-lock.json
git pull
git checkout mainnet-20210811T1200Z
npm install
popd

# Update current repository
npm install
