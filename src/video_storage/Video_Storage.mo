import HashMap "mo:base/HashMap";
import Text "mo:base/Text";

actor Video_Storage {

	public type VideoId = Text;
	public type IPFSData = Text; //TODO
	public type ChunkData = [Nat8];
	public type ChunkNum = Nat;

	class Chunk(chunkData : ChunkData, chunkNum : ChunkNum) = {
		var data = chunkData;
		var num = chunkNum;
	};

	public type VideoDataType = {
		#inContainer : Chunk;
		#simpleDistMap : Chunk;
		#ipfs : IPFSData
	};
	public type GetStorageType = {
		#inContainer : ChunkNum;
		#simpleDistMap : ChunkNum;
		#ipfs : IPFSData
	};
	public type StorageType = {
		#inContainer;
		#simpleDistMap;
		#ipfs : IPFSData;
	};

	let videoStorageTypes = HashMap.HashMap<Text, StorageType>(3, Text.equal, Text.hash);

	public func putVideo(videoId : VideoId, storageType : VideoDataType) : async () {
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

	public func getVideo(videoId : VideoId, storageType : GetStorageType) : async ?VideoDataType {
		switch (storageType) {
			case (#inContainer chunk) {
				null //TODO
			};
			case (#simpleDistMap chunk) {
				null //TODO
			};
			case (#ipfs IPFSData) {
				let (#ipfs data) = videoStorageTypes.get(videoId);
				data
			};
		}
	};
}
