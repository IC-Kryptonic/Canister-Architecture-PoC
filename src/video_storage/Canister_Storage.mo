import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Hash "mo:base/Hash";

import Types "Types";


actor class Canister_Storage(initMapSize: Nat) {
	
	let chunks_store = HashMap.HashMap<Types.VideoId, Types.Chunks>(initMapSize, Text.equal, Text.hash);

	public func put(videoId : Types.VideoId, chunk : Types.Chunk) : async () {
		switch (chunks_store.get(videoId)) {
			case (?chunks){
				chunks.put(chunk.num, chunk.data)
			};
			case (null){
				let chunks = HashMap.HashMap<Types.ChunkNum, Types.ChunkData>(chunk.num, Nat.equal, Hash.hash); 
				chunks.put(chunk.num, chunk.data);
				chunks_store.put(videoId, chunks);
			}
		};
	};

	public func get(videoId : Types.VideoId, chunkNum : Types.ChunkNum) : async ?Types.Chunk {
		switch (chunks_store.get(videoId)) {
			case (?chunks){
				switch (chunks.get(chunkNum)) {
					case (?chunk) {
						return ?(Types.Chunk(chunk, chunkNum));
					};
					case (null){
						return null;
					};
				};
			};
			case (null){
				return null;
			};
		};
	};
};
