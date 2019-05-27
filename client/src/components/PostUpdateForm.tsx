import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Post } from '../types';

interface Props {
  post: Post;
  updatePost: (oldId: number, title: string, body: string) => {};
}

export const PostUpdateForm = ({ post, updatePost }: Props) => {
  const [ title, setTitle ] = useState(post.title);
  const [ body, setBody ] = useState(post.body);

  const updateTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const updateBody = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value);
  }
  const submitUpdate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updatePost(post.id, title, body);
    setTitle('');
    setBody('');
  }
  return <form onSubmit={submitUpdate}>
    <div>
      <label htmlFor="post-title">Title:</label>
      <input
        type="text" name="post-title"
        value={title} onChange={updateTitle}
      />
    </div>
    <div>
      <label htmlFor="post-body">Body:</label>
      <textarea
        name="post-body"
        value={body} onChange={updateBody}
      />
    </div>
    <div>
      <button type="submit">Update Post</button>
    </div>
  </form>
}