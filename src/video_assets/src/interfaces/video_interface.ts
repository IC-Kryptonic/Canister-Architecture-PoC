import {Principal} from "@dfinity/principal";

export interface VideoPost {
  owner: Principal;
  creator: Principal;
  name: string;
  description: string;
  keywords: Array<string>;
  thumbnail: string;
  views: bigint;
  likes: bigint;
  storageType: CanisterStorage;
}

export interface CreateVideoPost {
  name: string;
  description: string;
  keywords: Array<string>;
  thumbnail: File;
  video: File;
}

export interface CanisterStorage{
  chunkCount: bigint;
  canister: Principal;
}