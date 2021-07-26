import { Principal } from '@dfinity/principal';

export interface Profile {
    principal: Principal,
    name: string,
    likes: Object
}
