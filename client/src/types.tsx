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

export interface User {
  id: number;
  username: string;
  creation_date: string;
  last_updated: string;
  bio: string;
  posts: Array<Post>;
  token: string;
}

export const defaultUser = {
  id: -1, username: '', creation_date: '', last_updated: '',
  bio: '', posts: [], token: ''
};