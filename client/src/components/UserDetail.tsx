import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RouteComponentProps } from 'react-router';

import { NoMatch } from './NoMatch';
import { PostTitleList } from './PostTitleList';
import { User, defaultUser } from '../types';
import { resolveTime, API_HOST } from '../util';

type UserRouteVars = { username: string };

export const UserDetail = ({ match, ...props }: RouteComponentProps<UserRouteVars>) => {
  const [ user, setUserToView ] = useState<User>(defaultUser);
  const [ error, setError ] = useState('');
  const { username } = match.params;

  async function getUserByName(username: string) {
    const url = `${API_HOST}/users/${username}`;
    try {
      const result = await axios.get(url);
      const viewedUser = { ...result.data, token: '' };
      setUserToView(viewedUser);
    } catch {
      setError('An error occurred');
    }
  }

  useEffect(() => {
    getUserByName(username);
  }, [ username ]);

  if (error === '') {
    return user !== defaultUser ? <article>
      <h2>User: { user.username }</h2>
      <p>Account Created: {resolveTime(user.creation_date)}</p>
      { user.bio !== '' ? user.bio : null}
      <h3>Most Recent Posts</h3>
      <PostTitleList posts={user.posts}/>
    </article> : <article></article>;
  } else {
    const noMatchProps = { match, ...props };
    return <NoMatch {...noMatchProps} />;
  }
}