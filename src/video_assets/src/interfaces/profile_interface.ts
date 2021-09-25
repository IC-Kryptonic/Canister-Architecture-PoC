import {Principal} from "@dfinity/principal";
import {VideoPost} from "./video_interface";

export interface CreateProfilePost {
    name: string,
}

export interface LazyProfilePost {
    principal: Principal,
    name: string,
    likes: Array<Principal>,
    comments: Array<Principal>,
    viewed: Array<Principal>,
}

export interface ProfilePost{
    principal: Principal,
    name: string,
    likes: Array<VideoPost>,
    comments: Array<VideoPost>,
    viewed: Array<VideoPost>,
}

export interface LazyUserComment{
    commenter: Principal,
    comment: string,
}

export interface UserComment{
    commenter: LazyProfilePost,
    comment: string,
}
