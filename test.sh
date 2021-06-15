#!/bin/bash

set -e
echo "Running testing script..."

echo "Starting video backend integration tests"
cargo test -- --test-threads=1

echo "Starting replica"
dfx start --background --clean

echo "Deploying canister"
dfx deploy

set -x
dfx canister call backend createVideo '(record {video_id = ""; owner = principal "aaaaa-aa"; name = "video1"; description = "mountain dog"; keywords = vec {"scars"; "toast"}; chunk_count=1})'
dfx canister call backend getVideoInfo '("video1")'
dfx canister call backend putChunk '(blob "\CA\FF\EE", 0, "video1")'
dfx canister call backend getChunk '( 0, "video1")'
dfx canister call backend getDefaultFeed '(10)'
dfx canister call backend searchVideo '("toast")'
dfx canister call backend reset

dfx stop
