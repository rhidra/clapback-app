export class User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    image: string;
    description: string;

    level: string;
    verified: boolean;

    permissions: Array<string>;

    isFollowing?: boolean;

    viewsCounter?: number;
    likesCounter?: number;
    clapbacksCounter?: number;
    commentsCounter?: number;
}
