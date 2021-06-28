import Text "mo:base/Text";

module{

public type VideoId = Text;
public type IPFSData = Text; //TODO
public type ChunkData = [Nat8];
public type ChunkNum = Nat;

public class Chunk(chunkData : ChunkData, chunkNum : ChunkNum) = {
	var data = chunkData;
	var num = chunkNum;
};


};
