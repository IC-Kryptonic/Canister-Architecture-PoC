export interface Post {
  chunk_count: number;
  description: string;
  keywords: Array<string>;
  name: string;
  owner: Object;
  video_id: string;
  storage_type: Storage_Type; 
};

export interface Storage_Type {
  inCanister: number;
};

export interface Video_Data {
  inCanister: {
    data: Array<number>;
  };
};
