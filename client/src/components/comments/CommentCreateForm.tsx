import React, { useState, ChangeEvent } from 'react';
import { Post } from '../../types';

interface Props {
  parentPost: Post;
  createComment: (parentPost: Post, commentBody: string) => {};
}

export const CommentCreateForm = ({ parentPost, createComment }: Props) => {
  const [ body, setBody ] = useState('');

  const updateBody = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value);
  }

  const submitComment = () => {
    createComment(parentPost, body);
    setBody('');
  }
  return <form onSubmit={submitComment}>
    <div>
      <label htmlFor="comment-body">Leave a Comment:</label>
      <textarea
        name="comment-body"
        value={body}
        onChange={updateBody}
      />
    </div>
    <div>
      <button type="submit">Submit Comment</button>
    </div>
  </form>
}