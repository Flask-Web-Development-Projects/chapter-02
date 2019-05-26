import React from 'react';
import { Link } from 'react-router-dom';

import { resolveTime } from '../util';
import { Post } from '../types';

interface Props {
  post: Post;
}

export const PostListItem = ({ post }: Props) => {
  return <div>
    <Link to={ `/posts/${ post.id }` }>
      <header>
        <h2>{ post.title }</h2>
        <h3>Written by { post.author }{ resolveTime(post.creation_date) }</h3>
      </header>
    </Link>
    <p>{ post.body }</p>
    <p>
      <span>{ post.views } views</span>
      <span>{ post.liked_by.length } likes</span>
      <span>{ post.comments.length } comments</span>
    </p>
  </div>;
}