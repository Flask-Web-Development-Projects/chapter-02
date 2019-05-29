import React, { Dispatch, SetStateAction, useState } from 'react';
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
  updateComment: (parentPost: Post, commentId: number, commentBody: string) => {};
  deletePost: (deletedPost: Post) => {};
  updatePost: (oldId: number, title: string, body: string) => {};
  updatePostViews: (thePost?: Post) => {};
}

export const PostDetail = ({
  beingEdited, post, setPostToEdit, user, 
  createComment, deleteComment, updateComment,
  deletePost, updatePost, updatePostViews
}: Props) => {
  const [ editingComment, setEditedComment ] = useState(-1);

  updatePostViews(post);

  if (!post) return null;
  
  const updateFormComponents = { post, updatePost };
  const commentProps = { 
    deleteComment, post, user, editingComment,
    setEditedComment, updateComment
  }
  return <div>
    <header>
      <h2>{post.title}</h2>
      <h3>
        <Link to={`/users/${post.author}`}>Written by {post.author}</Link> {resolveTime(post.creation_date)} | Last updated {resolveTime(post.last_updated)}
      </h3>
    </header>
    {beingEdited === post.id ? <PostUpdateForm {...updateFormComponents} /> : <p>{post.body}</p>}
    <div>
      <button>Like this post</button>
    </div>
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
        {...commentProps}
      />)
    }
  </div>;
}