import React, { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';

import { CommentItem } from '../comments';
import { PostUpdateForm } from './PostUpdateForm';
import { Post, Comment, User, defaultUser } from '../../types';
import { resolveTime } from '../../util';
import { CommentCreateForm } from '../comments/CommentCreateForm';

interface Props {
  user?: User;
  beingEdited: number;
  post?: Post;
  setPostToEdit: Dispatch<SetStateAction<number>>;
  createComment: (parentPost: Post, commentBody: string) => {};
  deleteComment: (parentPost: Post, commentId: number) => {};
  deletePost: (deletedPost: Post) => {};
  updatePost: (oldId: number, title: string, body: string) => {};
}

export const PostDetail = ({
  beingEdited, post, setPostToEdit, user, 
  createComment, deleteComment, deletePost, updatePost
}: Props) => {
  if (!post) return null;
  const updateFormComponents = { post, updatePost };
  return <div>
    <header>
      <h2>{post.title}</h2>
      <h3>
        <Link to={`/users/${post.author}`}>Written by {post.author}</Link> {resolveTime(post.creation_date)} | Last updated {resolveTime(post.last_updated)}
      </h3>
    </header>
    {beingEdited === post.id ? <PostUpdateForm {...updateFormComponents} /> : <p>{post.body}</p>}
    <p>
      <span>{post.views} views</span>
      <span>{post.liked_by.length} likes</span>
      {
        (user && (user.username === post.author)) ?
          <>
            <button onClick={() => setPostToEdit(post.id)}>Edit</button>
            <button onClick={() => deletePost(post)}>Delete</button>
          </> :
          null
      }
    </p>
    {
      user === defaultUser ? null : <CommentCreateForm
        parentPost={post}
        createComment={createComment}  
      />
    }
    {
      post.comments.map((comment: Comment) => <CommentItem
        key={comment.id}
        comment={comment}
        deleteComment={deleteComment}
        post={post}
        user={user}
      />)
    }
  </div>;
}