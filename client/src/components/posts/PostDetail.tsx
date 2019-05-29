import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
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
  likePost: (thePost: Post, liked: boolean) => {};
}

export const PostDetail = ({
  beingEdited, post, setPostToEdit, user,
  createComment, deleteComment, updateComment,
  deletePost, updatePost, updatePostViews, likePost
}: Props) => {
  const [editingComment, setEditedComment] = useState(-1);
  const [likedBy, setLikedBy] = useState(post!.liked_by);
  
  useEffect(() => {updatePostViews(post!)}, []);
  
  if (!post) return null;
  
  async function manageLikes(wasLiked: boolean) {
    await likePost(post!, wasLiked);
    if (likedBy.includes(user!.username) && !wasLiked) {
      let likedList = likedBy.filter((name: string) => name !== user!.username);
      setLikedBy(likedList);
    } else if (!likedBy.includes(user!.username) && wasLiked) {
      let likedList = likedBy.concat(user!.username);
      setLikedBy(likedList);
    }
  }

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
      {
        user !== undefined && post.liked_by.includes(user.username) ?
          <button onClick={() => manageLikes(false)}>Unlike</button> :
          <button onClick={() => manageLikes(true)}>Like</button>
      }
    </div>
    <p>
      <span>{post.views} views</span>
      <span>{likedBy.length} likes</span>
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