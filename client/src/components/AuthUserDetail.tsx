import React, { useState, ChangeEvent } from 'react';

import { PostTitleList } from './PostTitleList';
import { User } from '../types';
import { resolveTime } from '../util';

interface Props {
  authUser: User;
}

export const AuthUserDetail = ({ authUser }: Props) => {
  const [ username, setUsername ] = useState(authUser.username);
  const [ editingUsername, setUsernameEdit ] = useState(false);

  const updateUsername = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  }

  return <article>
    <h2>
      {
        editingUsername ?
        `User: ${authUser.username} ${<button onClick={() => setUsernameEdit(true)}>Edit</button>}` :
        `Username: ${<input
          type="text" name="username"
          value={ username } onChange={ updateUsername }
        />}`
      }
    </h2>
    <p>Account Created: {resolveTime(authUser.creation_date)}</p>
    <p>Last Updated: {resolveTime(authUser.last_updated)}</p>
    <section>
      Bio: {authUser.bio !== '' ? authUser.bio : '--'}
    </section>
    <h3>Most Recent Posts</h3>
    <PostTitleList posts={authUser.posts} />
  </article>
}