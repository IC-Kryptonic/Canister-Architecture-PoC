import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Types "Types";


actor class Canister_Storage(initMapSize: Nat) {
	
	let chunks_store = HashMap.HashMap<Types.VideoId, Types.Chunks>(initMapSize, Text.equal, Text.hash);

	public func put(videoId : Types.VideoId, chunk : Types.Chunk) : async () {
		switch (chunks_store.get(videoId)) {
			case (?chunks){
				chunks.put(chunk.num, chunk.data)
			};
			case (null){
				()
			}
		};
	};

	public func get(videoId : Types.VideoId, chunkNum : Types.ChunkNum) : async ?Types.ChunkData {
		switch (chunks_store.get(videoId)) {
			case (?chunks){
				return ?chunks[chunkNum];
			};
			case (null){
				return null;
			};
		};
	};
};
