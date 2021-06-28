import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Types "Types";
import Canister_Store "Canister_Storage";

actor Video_Storage {
	
	var Canister_store: ?Canister_Store.Canister_Storage = null;

	public type VideoData = {
		#inCanister : Types.ChunkData;
		#simpleDistMap : Types.ChunkData;
		#ipfs : Types.IPFSData
	};
	public type GetStorageType = {
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

	public func putVideo(videoId : Types.VideoId, storageType : VideoData) : async () {
		let storeType = switch (storageType) {

			case (#inCanister chunk) {
				if (Canister_store == null) {
					Canister_store := ? (await Canister_Store.Canister_Storage(1));
				};
				//TODO
				#inCanister
			};

			case (#simpleDistMap chunk) {
				//TODO
				#simpleDistMap
			};

			case (#ipfs data) {
				//TODO
				#ipfs data
			};
		};
		videoStorageTypes.put(videoId, storeType);
	};

	public func getVideoType(videoId: Types.VideoId) : async ?StorageType {
	 (videoStorageTypes.get(videoId))
	};

	public func getVideo(videoId : Types.VideoId, storageType : GetStorageType) : async ?VideoData {
		switch (storageType) {
			
			case (#inCanister chunkNum) {
				switch (Canister_store){
					case null {
					return null
					};
					case (?Canister_store){
						switch (await Canister_store.get(videoId, chunkNum)){
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
