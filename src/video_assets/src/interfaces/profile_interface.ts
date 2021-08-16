import { Principal } from '@dfinity/principal';

export interface Profile {
    principal: Principal,
    name: string,
    bio: string,
    likes: Array<String>
    follows: Object,
    followers: Object,
}

export interface ProfileUpdate {
    name: string,
    bio: string,
}
