import React from 'react';
import { User } from '../types';
import { resolveTime } from '../util';

interface Props {
    user: User;
}

export const UserDetail = ({ user }: Props) => {
  return <article>
    <h2>User: { user.username }</h2>
    <p>Account Created: {resolveTime(user.creation_date)}</p>
    { user.bio !== '' ? user.bio : null}
    <h3>Most Recent Posts</h3>
  </article>
}