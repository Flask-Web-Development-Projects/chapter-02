import React from 'react';
import { Post, Comment } from '../types';
import { resolveTime } from '../util';

interface Props {
    post?: Post;
}

export const PostDetail = ({ post }: Props) => {
  if (!post) return;
  return <div>
    <header>
      <h2>{post.title}</h2>
      <h3>Written by {post.author} {resolveTime(post.creation_date)} | Last updated { resolveTime(post.last_updated)}</h3>
    </header>
    <p>{post.body}</p>
    <p>
      <span>{post.views} views</span>
      <span>{post.liked_by.length} likes</span>
    </p>
    { post.comments.map((comment: Comment) => {
      <div key={ comment.id }>
        <p>{ comment.body }</p>
        <p>Written by { comment.author }</p>
        <p>Posted {resolveTime( comment.creation_date )} </p>
      </div>
    }) }
  </div>
}