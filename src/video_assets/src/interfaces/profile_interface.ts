import { Principal } from '@dfinity/principal';

export interface Profile {
    principal: Principal,
    name: string,
    bio: string,
    likes: Array<String>
    follows: Principal[],
    followers: Principal[],
}

export interface ProfileUpdate {
    name: string,
    bio: string,
}
