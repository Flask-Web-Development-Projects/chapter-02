import React, { useState, ChangeEvent } from 'react';

export const CommentCreateForm = () => {
  const [ body, setBody ] = useState('');

  const updateBody = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value);
  }
  return <form>
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