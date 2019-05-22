import React from 'react';
import { Post } from '../types';
import { resolveTime } from '../util';

interface Props {
  post: Post;
}

export const PostListItem = ({ post }: Props) => {
  return <div>
    <header>
      <h2>{ post.title }</h2>
      <h3>Written by { post.author }{ resolveTime(post) }</h3>
    </header>
    <p>{ post.body }</p>
    <p>
      <span>{ post.views } views</span>
      <span>{ post.liked_by.length } likes</span>
      <span>{ post.comments.length } comments</span>
    </p>
  </div>;
}