import React, { useState, ChangeEvent, useEffect } from 'react';

import { PostTitleList } from './PostTitleList';
import { User } from '../types';
import { resolveTime } from '../util';

interface Props {
  authUser: User;
  updateUser: (field: string, value: string) => {};
}

export const AuthUserDetail = ({ authUser, updateUser }: Props) => {
  const [ username, setUsername ] = useState('');
  const [ editingUsername, setUsernameEdit ] = useState(false);

  const [ bio, setBio ] = useState(''); 
  const [ editingBio, setBioEdit ] = useState(false);

  useEffect(() => {
    setUsername(authUser.username);
    setBio(authUser.bio);
  }, [authUser]);

  console.log('foo');

  const updateUsername = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  }
  const cancelUsername = () => {
    setUsernameEdit(false);
    setUsername(authUser.username);
  }
  const submitUsername = () => {
    updateUser('username', username);
    setUsernameEdit(false);
  }

  const updateBio = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBio(event.target.value);
  }
  const cancelBio = () => {
    setBioEdit(false);
    setBio(authUser.username);
  }
  const submitBio = () => {
    updateUser('bio', bio);
    setBioEdit(false);
  }

  return <article>
    <h2>
      User: 
      {
        editingUsername ?
        <>
          <input
            type="text" name="username"
            value={ username } onChange={ updateUsername }
          />
          <button onClick={submitUsername}>Update</button>
          <button onClick={cancelUsername}>Cancel</button>
        </> : <>
          { authUser.username }
          <button onClick={() => setUsernameEdit(true)}>Edit</button>
        </>
    }
    </h2>
    <p>Account Created: {resolveTime(authUser.creation_date)}</p>
    <p>Last Updated: {resolveTime(authUser.last_updated)}</p>
    <section>
      Bio: {
        editingBio ?
        <>
          <textarea
            name="user-bio" value={ bio } onChange={ updateBio }
          />
          <button onClick={submitBio}>Update</button>
          <button onClick={cancelBio}>Cancel</button>
        </> : <>
          { authUser.bio !== '' ? authUser.bio : '--' }
          <button onClick={() => setBioEdit(true)}>Edit</button>
        </>
      }
    </section>
    <h3>Most Recent Posts</h3>
    <PostTitleList posts={authUser.posts} />
  </article>
}