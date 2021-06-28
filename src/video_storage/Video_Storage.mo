import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Types "Types";
import Container_Store "Container_Storage";

actor Video_Storage {
	
	var container_store: ?Container_Store.Container_Storage = null;

	public type VideoData = {
		#inContainer : Types.ChunkData;
		#simpleDistMap : Types.ChunkData;
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

	public func putVideo(videoId : Types.VideoId, storageType : VideoData) : async () {
		let storeType = switch (storageType) {

			case (#inContainer chunk) {
				if (container_store == null) {
					container_store := ? (await Container_Store.Container_Storage(1));
				};
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

	public func getVideo(videoId : Types.VideoId, storageType : GetStorageType) : async ?VideoData {
		switch (storageType) {
			
			case (#inContainer chunkNum) {
				switch (container_store){
					case null {
					return null
					};
					case (?container_store){
						switch (await container_store.get(videoId, chunkNum)){
							case (?chunk) {
								return ?(#inContainer chunk);
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
