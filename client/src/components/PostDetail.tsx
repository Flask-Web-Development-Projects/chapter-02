import React from 'react';
import { Post, Comment, User } from '../types';
import { resolveTime } from '../util';

interface Props {
    post?: Post;
    user?: User;
}

export const PostDetail = ({ post, user }: Props) => {
  if (!post) return null;
  return <div>
    <header>
      <h2>{post.title}</h2>
      <h3>Written by {post.author} {resolveTime(post.creation_date)} | Last updated { resolveTime(post.last_updated)}</h3>
    </header>
    <p>{post.body}</p>
    <p>
      <span>{post.views} views</span>
      <span>{post.liked_by.length} likes</span>
      { 
        (user && (user.username === post.author)) ?
        <button>Edit</button> : 
        null 
      }
    </p>
    { post.comments.map((comment: Comment) => 
      <div key={ comment.id }>
        <p>{ comment.body }</p>
        <p>Written by { comment.author }</p>
        <p>Posted {resolveTime( comment.creation_date )} </p>
      </div>
    ) }
  </div>
}