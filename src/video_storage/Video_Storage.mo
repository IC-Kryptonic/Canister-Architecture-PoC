import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Types "Types";

actor Video_Storage {

	public type VideoDataType = {
		#inContainer : Types.Chunk;
		#simpleDistMap : Types.Chunk;
		#ipfs : Types.IPFSData
	};
	public type GetStorageType = {
		#inContainer : Types.ChunkNum;
		#simpleDistMap : Types.ChunkNum;
		#ipfs : Types.IPFSData
	};
	public type StorageType = {
		#inContainer;
		#simpleDistMap;
		#ipfs : Types.IPFSData;
	};

	let videoStorageTypes = HashMap.HashMap<Types.VideoId, StorageType>(3, Text.equal, Text.hash);

	public func putVideo(videoId : Types.VideoId, storageType : VideoDataType) : async () {
		let storeType = switch (storageType) {
			case (#inContainer chunk) {
				//TODO
				#inContainer
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

	public func getVideo(videoId : Types.VideoId, storageType : GetStorageType) : async ?VideoDataType {
		switch (storageType) {
			case (#inContainer chunk) {
				null //TODO
			};
			case (#simpleDistMap chunk) {
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
