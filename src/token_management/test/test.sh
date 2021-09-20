#!/bin/bash
dfx stop
dfx start --clean --no-artificial-delay --background

deploy_identity="token_test_deploy"
video_share_seller_identity="token_test_seller"
video_share_buyer_identity="token_test_buyer"
dex_identity="token_test_dex"

dfx identity new $deploy_identity
dfx identity new $video_share_seller_identity
dfx identity new $video_share_buyer_identity
dfx identity new $dex_identity

dfx identity use $deploy_identity

echo "TKM-TEST: Running token management test script"

echo "TKM-TEST: DFX should already be running for this project"

echo "TKM-TEST: Deploying token management canister"
dfx deploy token_management

echo "TKM-TEST: Deploying native token canister"
dfx deploy native_token
native_token_id=$(dfx canister id native_token)
echo $native_token_id

echo "TKM-TEST: Deploying dex canister"
dfx deploy dex --argument '("'$(dfx canister id native_token)'")'
dex_id=$(dfx canister id dex)
echo $dex_id

echo "TKM-TEST: Deploying test util canister"
dfx deploy test_util

echo "TKM-TEST: Video token count should be: <(0)>"
dfx canister call token_management getTokenCount

dfx identity use $video_share_seller_identity

echo "TKM-TEST: Creating video token: (TEST, TST, 2, 200, {})"
dfx canister call token_management createToken '("TEST", "TST", 2, 200, "{}")'

echo "TKM-TEST: Video token count after creation should be: <(1)>"
dfx canister call token_management getTokenCount

echo "TKM-TEST: get all tokens should return vector with the single created token:"

output=$(dfx canister call token_management getAllTokens)
while read -r line; do
    echo "$line"
    if [[ $line == *"canisterId"* ]]; then
        line_with_id=$line
    fi
done <<< "$output"
video_token_id=${line_with_id:14:27}
echo $video_token_id 

# TODO 
# 1. seller gives allowance to dex canister on video token
# test_principal=$(dfx identity get-principal)
# dfx canister call $video_token_id approve '( record {subaccount=null; spender=("principal '$test_principal'"); allowance=(10 : nat); token=""} )'
# 2. seller creates offer on dex
# 3. buyer acquires native tokens from faucet
# 4. buyer gives allowance to dex canister on native token
# 5. buyer executes exchange on dex

dfx stop 
exit 0