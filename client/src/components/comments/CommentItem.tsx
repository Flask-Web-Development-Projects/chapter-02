import React from 'react';
import { Link } from 'react-router-dom';

import { Comment, User, Post, defaultUser } from '../../types';
import { resolveTime } from '../../util';

interface Props {
  comment: Comment;
  post: Post;
  user?: User;
  deleteComment: (parentPost: Post, commentId: number) => {};
}

export const CommentItem = ({ comment, post, user, deleteComment }: Props) => {
  return <div>
    <p>{comment.body}</p>
    <p>Written by <Link to={`/users/${comment.author}`}>{comment.author}</Link></p>
    <p>Posted {resolveTime(comment.creation_date)}</p>
    {
      (user !== defaultUser) &&
      (user !== undefined) &&
      (user.username === comment.author) ?
      <section>
        <button>Edit</button>
        <button onClick={() => deleteComment(post, comment.id)}>
          Delete
        </button>
      </section> :
      null
    }
  </div>
}