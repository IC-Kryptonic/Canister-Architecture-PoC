import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import P "mo:base/Prelude";

import Types "Types";
import Canister_Store "Canister_Storage";

actor Video_Storage {
	
	var canister_store: ?Canister_Store.Canister_Storage = null;

	public type VideoData = {
		#inCanister : Types.Chunk;
		#simpleDistMap : Types.Chunk;
		#ipfs : Types.IPFSData
	};
	public type GetVideoType = {
		#inCanister : Types.ChunkNum;
		#simpleDistMap : Types.ChunkNum;
		#ipfs : Types.IPFSData
	};
	public type StorageType = {
		#inCanister;
		#simpleDistMap;
		#ipfs : Types.IPFSData;
	};

	let videoStorageTypes = HashMap.HashMap<Types.VideoId, StorageType>(3, Text.equal, Text.hash);

	public func putVideo(videoId : Types.VideoId, storageData : VideoData) : async () {
		let storeType = switch (storageData) {

			case (#inCanister chunk) {
				if (canister_store == null) {
					canister_store := ? (await Canister_Store.Canister_Storage(1));
				};
				switch canister_store {
					case (?canister_store){
						await canister_store.put(videoId, chunk);
						#inCanister
					};
					case null {
						P.unreachable()
					};
				};
			};

			case (#simpleDistMap chunk) {
				P.nyi();
				#simpleDistMap
			};

			case (#ipfs data) {
				P.nyi();
				#ipfs data
			};
		};
		videoStorageTypes.put(videoId, storeType);
	};

	public func getVideoType(videoId: Types.VideoId) : async ?StorageType {
	 (videoStorageTypes.get(videoId))
	};

	public func getVideo(videoId : Types.VideoId, storageType : GetVideoType) : async ?VideoData {
		switch (storageType) {
			
			case (#inCanister chunkNum) {
				switch (canister_store){
					case null {
						return null
					};
					case (?canister_store){
						switch (await canister_store.get(videoId, chunkNum)){
							case (?chunk) {
								return ?(#inCanister chunk);
							};
							case null {
								return null
							};
						};
					};
				};
			};

			case (#simpleDistMap chunkNum) {
				P.nyi();
				null //TODO
			};

			case (#ipfs IPFSData) {
				switch (videoStorageTypes.get(videoId)){
					case (?(#ipfs data)) {
						return ?(#ipfs data)
					};
					case _ {
						return null
					};
				};
			};
		}
	};
}
