#!/bin/bash

set -ex

./bucket_creation.sh

dfx deploy backend

dfx canister call video_dht createVideo '("id", 1)'
dfx canister call video_dht insertChunk '("id", 0, blob "\CA\FF\EE")'
dfx canister call video_dht getChunk '("id", 0)'
dfx canister call video_dht getBucketPrincipal '("id")'

dfx canister call backend createVideo '(record {video_id = null; owner = principal "aaaaa-aa"; name = "video1"; description = "mountain dog"; keywords = vec {"scars"; "toast"}; storage_type = variant {simpleDistMap = record {1; null}}})'
