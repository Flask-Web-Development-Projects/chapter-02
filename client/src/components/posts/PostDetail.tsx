import React, { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';

import { PostUpdateForm } from './PostUpdateForm';
import { Post, Comment, User } from '../../types';
import { resolveTime } from '../../util';

interface Props {
    post?: Post;
    user?: User;
    beingEdited: number;
    setPostToEdit: Dispatch<SetStateAction<number>>;
    updatePost: (oldId: number, title: string, body: string) => {};
    deletePost: (deletedPost: Post) => {};
}

export const PostDetail = ({
  post, user, beingEdited, setPostToEdit, updatePost, deletePost
}: Props) => {
  if (!post) return null;
  const updateFormComponents = { post, updatePost };
  return <div>
    <header>
      <h2>{post.title}</h2>
      <h3>
        <Link to={`/users/${post.author}`}>Written by {post.author}</Link> {resolveTime(post.creation_date)} | Last updated { resolveTime(post.last_updated)}
      </h3>
    </header>
    {beingEdited === post.id ? <PostUpdateForm {...updateFormComponents} /> : <p>{post.body}</p>}
    <p>
      <span>{post.views} views</span>
      <span>{post.liked_by.length} likes</span>
      { 
        (user && (user.username === post.author)) ?
        <>
          <button onClick={ () => setPostToEdit(post.id) }>Edit</button>
          <button onClick={ () => deletePost(post) }>Delete</button>
        </> : 
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