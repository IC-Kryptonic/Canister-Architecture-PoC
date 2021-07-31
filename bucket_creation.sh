#!/bin/bash

set -ex
dfx canister create bucket
dfx build bucket

ic-cdk-optimizer target/wasm32-unknown-unknown/release/bucket.wasm -o target/wasm32-unknown-unknown/release/bucket_opt.wasm
