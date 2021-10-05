#!/bin/bash

echo "Starting canister tests"
cargo test --color=always --bin=canister_tests -- --test-threads=1 --show-output
