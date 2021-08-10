import {Principal} from "@dfinity/principal";
import {Chunk_Num} from "../../../../.dfx/local/canisters/backend/backend";

export interface Post {
  chunk_count: number;
  description: string;
  keywords: Array<string>;
  name: string;
  owner: Object;
  video_id: string;
  storage_type: InCanister_Storage_Type | SimpleDHT_Storage_Type;
};

export interface InCanister_Storage_Type {
  inCanister: number;
};

export interface SimpleDHT_Storage_Type { 'simpleDistMap' : [Chunk_Num, [] | [Principal]] }


export interface Video_Data {
  inCanister: {
    data: Array<number>;
  };
};
