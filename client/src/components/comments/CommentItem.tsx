import React from 'react';
import { Link } from 'react-router-dom';

import { Comment } from '../../types';
import { resolveTime } from '../../util';

interface Props {
  comment: Comment;
}

export const CommentItem = ({ comment }: Props) => {
  return <div>
    <p>{comment.body}</p>
    <p>Written by <Link to={`/users/${comment.author}`}>{comment.author}</Link></p>
    <p>Posted {resolveTime(comment.creation_date)} </p>
  </div>
}