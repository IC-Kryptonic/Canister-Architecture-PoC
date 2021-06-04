#!/bin/bash

echo "Running testing script..."

echo "Starting video backend integration tests"
cargo test -- --test-threads=1

echo "Starting replica"
dfx start --background --clean

echo "Deploying canister"
dfx deploy

set -x
dfx canister call rust_video createVideo '(record {video_id = ""; name = "video1"; description = "mountain dog"; keywords = vec {"scars"; "toast"}; chunk_count=1})'
dfx canister call rust_video getVideoInfo '("video1")'
dfx canister call rust_video putChunk '(blob "\CA\FF\EE", 0, "video1")'
dfx canister call rust_video getChunk '( 0, "video1")'
dfx canister call rust_video getDefaultFeed '(10)'
dfx canister call rust_video searchVideo '("toast")'
dfx canister call rust_video reset

dfx stop
