import React from 'react';
import { Link } from 'react-router-dom';

import { resolveTime } from '../util';
import { Post } from '../types';

interface Props {
  post: Post;
}

export const PostListItem = ({ post }: Props) => {
  return <div>
    <header>
      <Link to={ `/posts/${ post.id }` }>
        <h2>{ post.title }</h2>
      </Link>
      <h3>
        <Link to={`/users/${post.author}`}>Written by {post.author}</Link> { resolveTime(post.creation_date) }
      </h3>
    </header>
    <p>{ post.body }</p>
    <p>
      <span>{ post.views } views</span>
      <span>{ post.liked_by.length } likes</span>
      <span>{ post.comments.length } comments</span>
    </p>
  </div>;
}