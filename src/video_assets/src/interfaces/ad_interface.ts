import {CreateVideoPost, VideoPost} from "./video_interface";

export interface AdPost extends VideoPost{
}

export interface CreateAdPost extends CreateVideoPost{
    allowance: bigint,
    amountPerView: bigint,
}