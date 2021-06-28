import Text "mo:base/Text";
import HashMap "mo:base/HashMap";

module{

public type VideoId = Text;
public type IPFSData = Text; //TODO
public type ChunkData = Blob;
public type ChunkNum = Nat;

public type Chunks = HashMap.HashMap<ChunkNum ,ChunkData>;

public class Chunk(chunkData : ChunkData, chunkNum : ChunkNum) = {
	public let data = chunkData;
	public let num = chunkNum;
};

};
