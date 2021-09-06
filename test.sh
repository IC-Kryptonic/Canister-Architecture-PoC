#!/bin/bash

set -e
echo "Running testing script..."

echo "Starting replica"
dfx start --background --clean --no-artificial-delay

echo "Compiling and optimizing bucket code"
./bucket_creation.sh
echo "Deploying backend and dht canister"
dfx deploy backend

echo "Starting canister tests"
cargo test --color=always --bin=canister_tests -- --test-threads=1 --show-output

set -x

dfx canister call backend createVideo '(record {video_id = null; owner = principal "aaaaa-aa"; creator = principal "aaaaa-aa"; name = "video1"; description = "mountain dog"; keywords = vec {"scars"; "toast"}; storage_type = variant {simpleDistMap = record {1; null}}})'

dfx canister call backend createVideo '(record {video_id = null; owner = principal "aaaaa-aa"; creator = principal "aaaaa-aa"; name = "video1"; description = "mountain dog"; keywords = vec {"scars"; "toast"}; storage_type = variant {inCanister = 1}})'
dfx canister call backend getVideoInfo '("video1")'
dfx canister call backend storeVideo '("video1", variant {inCanister = record { "data" = blob "\CA\FF\EE"; "num" = 0 : nat64}})'
dfx canister call backend loadVideo '("video1", variant {inCanister = 0 : nat64})'
dfx canister call backend getDefaultFeed '(10)'
dfx canister call backend searchVideo '("toast")'
dfx canister call backend getCreatorFeed '(principal "aaaaa-aa")'
dfx canister call backend getOwnerFeed '(principal "aaaaa-aa")'
dfx canister call backend searchFeed '("dog")'
dfx canister call backend reset

dfx canister call backend getProfile '(principal "aaaaa-aa")'
dfx canister call backend getCurrentProfile
dfx canister call backend createProfile '(record {"principal" = principal "aaaaa-aa"; name = "testuser" ; likes = vec {}})'
dfx canister call backend likeVideo '("videoId")'


dfx canister call video_dht createVideo '("id", 1)'
dfx canister call video_dht insertChunk '("id", 0, blob "\CA\FF\EE")'
dfx canister call video_dht getChunk '("id", 0)'
dfx canister call video_dht getBucketPrincipal '("id")'


dfx stop
