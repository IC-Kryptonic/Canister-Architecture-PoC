actor Video_Storage {

	public type VideoId = Text;
	public type IPFSData = Text; //TODO
	public type ChunkData = [Nat8]
	public type ChunkNum = Nat;

	class Chunk(chunkData : ChunkData, chunkNum : ChunkNum){
		var data = chunkData;
		var num = chunkNum;
	}

	public type VideoDataType = {#inContainer Chunk; #simpleDistMap Chunk; #ipfs IPFSData}
	public type StorageType = {#inContainer ChunkNum; #simpleDistMap ChunkNum; #ipfs IPFSData}

	public func putVideo(videoId : VideoId, storageType : VideoDataType) : async () {
		switch (storageType) {
			case #inContainer chunk {
				//TODO
			}
			case #simpleDistMap chunk {
				//TODO
			}
			case #ipfs IPFSData {
				//TODO
			}
		}
	}

	public func getVideo(videoId : VideoId, storageType : StorageType) : async ?VideoDataType {
		switch (storageType) {
			case #inContainer chunk {
				//TODO
			}
			case #simpleDistMap chunk {
				//TODO
			}
			case #ipfs IPFSData {
				//TODO
			}
		}
	}
}
