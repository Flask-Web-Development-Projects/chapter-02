import React, { useState, ChangeEvent, FormEvent } from 'react';

interface Props {
  createPost: (title: string, body: string) => {};
}

export const CreatePostForm = ({ createPost }: Props) => {
    const [ title, setTitle ] = useState('');
    const [ body, setBody ] = useState('');

    const updateTitle = (event: ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
    };
    const updateBody = (event: ChangeEvent<HTMLInputElement>) => {
      setBody(event.target.value);
    }
    const submitPost = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      createPost(title, body);
      setTitle('');
      setBody('');
    }

    return <form onSubmit={ submitPost }>
      <div>
        <label htmlFor="post-title">Title:</label>
        <input
          type="text" name="post-title"
          value={ title } onChange={ updateTitle }
        />
      </div>
      <div>
        <label htmlFor="post-body">Body:</label>
        <input
          type="text" name="post-body"
          value={ body } onChange={ updateBody }
        />
      </div>
      <div>
        <button type="submit">Submit Post</button>
      </div>
    </form>
}