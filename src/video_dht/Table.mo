import Array "mo:base/Array";
import Cycles "mo:base/ExperimentalCycles";
import Hash "mo:base/Text";
import Buckets "Buckets";

actor Table {

  let n = 1000; // number of buckets

  type Key = Nat;
  type Value = Blob;
  type ID = Text;

  type Bucket = Buckets.Bucket;

  let buckets : [var ?Bucket] = Array.init(n, null);

  public func get(id : Text, chunk_num : Nat) : async ?Value {
    let k = id.hash();
    
    switch (buckets[k % n]) {
      case null null;
      case (?bucket) await bucket.get(id, chunk_num);
    };
  };

  public func put( : Key, v : Value) : async () {
    let i = k % n;
    let bucket = switch (buckets[i]) {
      case null {
        // provision next send, i.e. Bucket(n, i), with cycles
        Cycles.add(cycleShare);
        let b = await Buckets.Bucket(n, i); // dynamically install a new Bucket
        buckets[i] := ?b;
        b;
      };
      case (?bucket) bucket;
    };
    await bucket.put(k, v);
  };

};
