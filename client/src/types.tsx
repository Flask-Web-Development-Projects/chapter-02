export interface Post {
    id: number;
    title: string;
    body: string;
    author: string;
    creation_date: string;
    last_updated: string;
    views: number;
    liked_by: Array<string>;
    comments: Array<Comment>;
}

export interface Comment {
    id: number;
    body: string;
    author: string;
    creation_date: string;
    last_updated: string;
    parent: number;
}