import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Float";

import ExtAllowance "../src/tokens/ext/Allowance";
import ExtCore "../src/tokens/ext/Core";
import Types "../src/types/Types";

actor class TokenTest (_nativeTokenCanisterId: Text, _dexCanisterId: Text) = this{
    type ExchangeError = Types.ExchangeError;
    
    type ExchangeError = {
        #InsufficientBalance: Nat;
        #InsufficientAllowance: Nat;
        #Other : Text;
    };

    type NativeTokenActor = actor {
        checkAllowance: (a: Principal, b: Principal) -> async Result.Result<Nat, ExtCore.CommonError>;
        approve: (request: ExtAllowance.ApproveRequest) -> async ();
    };
    type DexActor = actor {
        createOffer: (tokenId: Text, pricePerShare: Nat, shareAmount: Nat) -> async Result.Result<(), ExchangeError>;
        realizeExchange: (currentOwner: Text, tokenId: Text, pricePerShare: Nat, shareAmount: Nat) -> async Result.Result<(), ExchangeError>;
    };

    let nativeToken = actor(_nativeTokenCanisterId) : NativeTokenActor;
    let tokenSpender = "zhvez-t6q5m-vbg5q-yoynm-lh5tq-czlni-5nc7c-plnu5-x36ql-bx6gk-qae";
    let invalidTokenSpender = "gocug-k6wsl-55ktj-vnkeu-6gskl-xpve6-p5rcb-2i3t3-p2qck-gcnzu-fae";
    let currentOwner = "74tei-u2miv-6ksf4-lsmax-t3fbl-5kapp-w5qbb-tx4x4-rwndu-ij2so-zqe";

    
    public func testCheckAllowance(): async() {
        let owner = Principal.fromActor(this);
        let spender = Principal.fromText(tokenSpender);
        let invalidSpender = Principal.fromText(invalidTokenSpender);
        // set allowance to 0 and assert 0 was set
        let approveRequestInitial = {
            subaccount = null;
            spender = spender;
            allowance = 0;
            token = ""; 
        };
        await nativeToken.approve(approveRequestInitial);
        let allowanceAmount = await nativeToken.checkAllowance(owner, spender);
        switch(allowanceAmount) {
            case (#ok(amount)) {
                assert(amount == 0);
                Debug.print("amount was 0 as expected");
            };
            case (_) {
                Debug.print("unexpected result");
            };
        };
        // set allowance to 5 and assert 5 was set
        let approveRequest = {
            subaccount = null;
            spender = spender;
            allowance = 5;
            token = ""; 
        };
        await nativeToken.approve(approveRequest);
        let newAmount = await nativeToken.checkAllowance(owner, spender);
        switch(newAmount) {
            case (#ok(amount)) {
                Debug.print("amount after allowance: " # Nat.toText(amount));
                assert(amount == 5);
                Debug.print("amount was 5 as expected");
            };
            case (_) {
                Debug.print("unexpected result");
            };
        };
        // check that invalid spender does not have allowance of 5
        let invalidSpenderAmount = await nativeToken.checkAllowance(owner, invalidSpender);
        switch(invalidSpenderAmount) {
            case (#ok(amount)) {
                Debug.print("amount for invalid spender: " # Nat.toText(amount));
                assert(amount == 0);
                Debug.print("amount was 0 as expected");
            };
            case (_) {
                Debug.print("unexpected result");
            };
        };
    };

    let dex = actor(_dexCanisterId) : DexActor;

    public func testCreateOffer(): async() {
        let spender = Principal.fromText(tokenSpender);
        let approveRequest = {
            subaccount = null;
            spender = spender;
            allowance = 5;
            token = ""; 
        };
        await nativeToken.approve(approveRequest);
        let newAmount = await nativeToken.checkAllowance(Principal.fromActor(this), spender);
        switch(newAmount) {
            case (#ok(amount)) {
                Debug.print("amount after allowance: " # Nat.toText(amount));
                assert(amount == 5);
                Debug.print("amount was 5 as expected");
            };
            case (_) {
                Debug.print("unexpected result");
            };
        };
        let result = await dex.createOffer(_nativeTokenCanisterId, 5, 5);
    };
}