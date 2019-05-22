import React from 'react';
import { Post } from '../types';

interface Props {
  post: Post;
}

export const PostListItem = ({ post }: Props) => {
  return <div>
    <header>{ post.title }</header>
    <p>{ post.body }</p>
  </div>;
}