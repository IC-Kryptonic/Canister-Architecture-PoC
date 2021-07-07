import Nat "mo:base/Nat";
import Map "mo:base/RBTree";

actor class Bucket(n : Nat, i : Nat) {

  type Key = Nat;
  type Value = [Blob];
  type ID = Text;

  let map = Map.RBTree<Key, Value>(Nat.compare);

  public func get(id : ID) : async ?Value {
    let k = id.hash();
    assert((k % n) == i);
    map.get(k);
  };

  public func put(k : Key, v : Value) : async () {
    assert((k % n) == i);
    map.put(k,v);
  };

};

