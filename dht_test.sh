#!/bin/bash

set -ex

dfx deploy video_dht 

dfx canister call video_dht createVideo '("id", 1)'
dfx canister call video_dht insertChunk '("id", 0, blob "\CA\FF\EE")'
dfx canister call video_dht getChunk '("id", 0)'
