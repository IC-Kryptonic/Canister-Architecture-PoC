#Writing Tests
We use the tokio async test framework which builds on the standard rust framework.

To build tests for a canister just create a new rust test module:

```rust

#[cfg(test)]
mod your_canister_tests {
    
}

```

You can create a test by writing a function with the tokio test macro

```rust

#[tokio::test]
async fn test_function() -> Result<(), String> {
    Ok(())
}

```

Assertions can be done as usual in Rust

```rust

assert_eq!(2+2, 4);
assert!(true);

```

##Identity
You can create random identities or generate new ones from PKECS8 bytes:

```rust

use crate::util;

let random_identity = util::generate_random_identity();
let specific_identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);

```

You can use the PEKCS8_BYTES constant if you want to generate multiple identities but don't care about the specific key.

To get the principal from an identity use the following:

```rust

let principal = identity.sender().expect("Could not deduce principal from identity");

```

##Actors
You can automatically create actors from a canister name and an identity the following way:

```rust

use crate::util;

let actor = util::Actor::from_name(canister_name, identity).await;

```

The identity will sign the requests to the canister.

To send requests to the canister use the following methods:

```rust

actor.query_call(canister_method_name, arguments).await;
actor.update_call(canister_method_name, arguments).await;

```

##Decoding & Encoding
The arguments send to the canister have to be encoded into bytes using the IDL. Use Candid to automatically encode structs and other types.

```rust

use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::candid::{Encode};

#[derive(CandidType, Deserialize)]
pub struct Argument {
    data: Vec<u8>,
}

#[tokio::test]
fn some_test() {
    let arg1 = Argument {
        data: vec![],
    };

    let encoded = Encode!(&arg1, &arg2, &arg3, ...).expect("Could not encode arguments");
}

```

To decode results from requests use Decode, it automatically converts the bytes into the Type you specified.

```rust

use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::candid::{Decode};

type Type = u8; //just as an example

let result = actor.query_call(method_name, args).await.unwrap();
let decoded = Decode!(result.as_slice(), Type).expect("Could not decode result into Type");

```

##Checking for errors in the results
If you want to automatically unwrap a result and assert that it is ok or an error you can use the methods check_ok() and check_err()

```rust

let response = actor.update_call(canister_method_name, args).await;

let result = util::check_ok(response); //or if you expect and error: let error = util::check_err(response);

```

#Testing

Start a local replica and deploy the test canisters, e.g.:

```

./start

```

To execute all tests use: (the tests have to be run single threaded since the local replica is not thread safe):

```

cargo test --bin=canister_tests -- --test-threads=1

```

More information on the testing options can be found at
https://doc.rust-lang.org/cargo/commands/cargo-test.html