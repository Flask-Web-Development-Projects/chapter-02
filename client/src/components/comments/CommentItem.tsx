import React, { Dispatch, SetStateAction, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

import { Comment, User, Post, defaultUser } from '../../types';
import { resolveTime } from '../../util';

interface Props {
  comment: Comment;
  post: Post;
  user?: User;
  editingComment: number;
  deleteComment: (parentPost: Post, commentId: number) => {};
  setEditedComment: Dispatch<SetStateAction<number>>;
  updateComment: (parentPost: Post, commentId: number, commentBody: string) => {};
}

export const CommentItem = ({
  comment, post, user, deleteComment, updateComment,
  editingComment, setEditedComment
}: Props) => {
  const [ commentBody, setCommentBody ] = useState(comment.body);
  const updateBodyText = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentBody(event.target.value);
  }
  const submitCommentUpdate = () => {
    updateComment(post, comment.id, commentBody);
  }
  return <div>
    <p>
    {
      editingComment === comment.id ?
      <>
        <textarea
          name="comment-body"
          value={commentBody}
          onChange={updateBodyText}
        />
        <button type="submit" onClick={submitCommentUpdate}>Update Comment</button>
      </> :
      comment.body
    }
    </p>
    <p>Written by <Link to={`/users/${comment.author}`}>{comment.author}</Link></p>
    <p>Posted {resolveTime(comment.creation_date)}</p>
    {
      (user !== defaultUser) &&
      (user !== undefined) &&
      (user.username === comment.author) ?
      <section>
        <button onClick={() => setEditedComment(comment.id)}>
          Edit
        </button>
        <button onClick={() => deleteComment(post, comment.id)}>
          Delete
        </button>
      </section> :
      null
    }
  </div>
}