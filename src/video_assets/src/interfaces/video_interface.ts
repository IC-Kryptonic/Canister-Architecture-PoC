import {Principal} from "@dfinity/principal";

export interface Post {
  owner: Principal;
  creator: Principal;
  name: string;
  description: string;
  keywords: Array<string>;
  thumbnail: string;
  views: number;
  likes: number;
  storageType: CanisterStorage;
}

export interface CreatePost {
  name: string;
  description: string;
  keywords: Array<string>;
  thumbnail: File;
  video: File;
}

export interface CanisterStorage{
  chunkCount: number;
  canister: Principal;
}