import React, { useState, ChangeEvent, useEffect } from 'react';

import { PostTitleList } from './PostTitleList';
import { User } from '../types';
import { resolveTime } from '../util';

interface Props {
  authUser: User;
  updateUser: (field: string, value: string) => {};
  updateUserPass: (oldPass: string, newPass: string, confirmPass: string) => {};
}

export const AuthUserDetail = ({ authUser, updateUser, updateUserPass }: Props) => {
  const [ username, setUsername ] = useState('');
  const [ editingUsername, setUsernameEdit ] = useState(false);

  const [ bio, setBio ] = useState(''); 
  const [ editingBio, setBioEdit ] = useState(false);

  const [ oldPass, setOldPass ] = useState('');
  const [ newPass, setNewPass ] = useState('');
  const [ confirmPass, setConfirmPass ] = useState('');
  const [ editingPass, setPassEdit ] = useState(false);
  const [ passErr, setPassErr ] = useState('');

  useEffect(() => {
    setUsername(authUser.username);
    setBio(authUser.bio);
  }, [authUser]);

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

  const updateOldPass = (event: ChangeEvent<HTMLInputElement>) => {
    setOldPass(event.target.value);
  }
  const updateNewPass = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPass(event.target.value);
  }
  const updateConfirmPass = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmPass(event.target.value);
  }
  const cancelPassUpdate = () => {
    setPassEdit(false);
    setOldPass('');
    setNewPass('');
    setConfirmPass('');
  }
  const submitPassUpdate = () => {
    if ((oldPass !== newPass) && (newPass === confirmPass)) {
      updateUserPass(oldPass, newPass, confirmPass);
      cancelPassUpdate();
    } else {
      if (oldPass === newPass) setPassErr('New password is the same as old password');
      if (newPass === confirmPass) setPassErr("Password confirmation doesn't match new password");
    }
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
    <section>
      {
        editingPass ?
        <>
          <button onClick={ submitPassUpdate }>Update Password</button>
          <button onClick={ cancelPassUpdate }>Cancel Password Change</button>
        </> :
        <button onClick={() => setPassEdit(true)}>Change Password</button>
      }
      <button>Delete User</button>
    </section>
    <section>
      {
        editingPass ?
        <form>
          { passErr === '' ? null : passErr }
          <div>
            Old Password: <input type="password" name="password" value={ oldPass } onChange={ updateOldPass }/>
          </div>
          <div>
            New Password: <input type="password" name="new-password" value={ newPass } onChange={ updateNewPass } />
          </div>
          <div>
            Confirm Password: <input type="password" name="confirm-pass" value={ confirmPass } onChange={ updateConfirmPass } />
          </div>
        </form> :
        null
      }
    </section>
    <h3>Most Recent Posts</h3>
    <PostTitleList posts={authUser.posts} />
  </article>
}