import Text "mo:base/Text";

module{

public type VideoId = Text;
public type IPFSData = Text; //TODO
public type ChunkData = [Nat8];
public type ChunkNum = Nat;

public type Chunks = [var ChunkData];

public class Chunk(chunkData : ChunkData, chunkNum : ChunkNum) = {
	public let data = chunkData;
	public let num = chunkNum;
};


};
