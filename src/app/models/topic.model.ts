import {User} from './user.model';

export class Topic {
    _id?: string;
    title: string;

    hashtags: Array<string>;
    suggestedHashtags: Array<string>;
    isPublic: boolean;
    isProcessing: boolean;
    date: string;

    centerPanel: TopicPanel;
    leftPanel: TopicPanel;
    rightPanel: TopicPanel;

    likesCounter?: number;
    viewsCounter?: number;
    commentsCounter?: number;
    clapbacksCounter?: number;
    hasLiked?: boolean;
}

export class TopicPanel {
    video: string;
    text: string;
    textAlt: string;
    image: string;
    quiz: string;
    author: User;
}
