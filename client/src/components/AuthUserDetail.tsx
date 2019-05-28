import React from 'react';

import { PostTitleList } from './PostTitleList';
import { User } from '../types';
import { resolveTime } from '../util';

interface Props {
  authUser: User;
}

export const AuthUserDetail = ({ authUser }: Props) => {
  return <article>
    <h2>User: { authUser.username }</h2>
    <p>Account Created: {resolveTime(authUser.creation_date)}</p>
    <p>Last Updated: {resolveTime(authUser.last_updated)}</p>
    {authUser.bio !== '' ? authUser.bio : null}
    <h3>Most Recent Posts</h3>
    <PostTitleList posts={authUser.posts} />
  </article>
}