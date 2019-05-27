import React, { FunctionComponent, useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, RouteComponentProps } from 'react-router-dom';

import { ForumHeader } from './components/ForumHeader';
import { NoMatch } from './components/NoMatch';
import { Overlay } from './components/Overlay';
import { PostDetail } from './components/PostDetail';
import { PostList } from './components/PostList';
import { UserDetail } from './components/UserDetail';

import { Post, User, defaultUser } from './types';
import { API_HOST } from './util';

import './App.css';

const App: FunctionComponent = () => {
  const [ posts, setPosts ] = useState<Array<Post>>([]);
  const [ beingEdited, setPostToEdit ] = useState(-1);

  const [ isLoggedIn, setIsLoggedIn ] = useState(false);

  const [ displayPostForm, togglePostForm ] = useState(false);
  const [ displayLoginForm, toggleLoginForm ] = useState(false);
  const [ displayRegistrationForm, toggleRegistrationForm ] = useState(false);
  
  const [ loginError, setLoginError ] = useState('');
  const [ registrationError, setRegistrationError ] = useState('');
  
  const [ user, setUser ] = useState<User>(defaultUser);
  const [ userToView, setUserToView ] = useState<User>(defaultUser);

  async function submitLogin(
    username: string, password: string, rememberMe: boolean
  ) {
    const url = `${API_HOST}/users/login`;
    try {
      const result = await axios.post(url, { username, password });
      setIsLoggedIn(true);
      toggleLoginForm(false);
      setLoginError('');
      const token = result.headers.authorization;
      setUser({...result.data, token});
      if (rememberMe) localStorage.setItem('userToken', token);
    } catch (error) {
      setLoginError(error.response.data.error);
    }
  }

  async function getAuthenticatedUser() {
    const token = localStorage.getItem('userToken');
    if (token) {
      const username = token.split(':')[0];
      const url = `${API_HOST}/users/${username}/authenticate`;
      try {
        const result = await axios.post(url, {}, {
          headers: {'Authorization': `Bearer ${token}`}
        });
        setIsLoggedIn(true);
        setUser({ ...result.data, token });
      } catch {
        localStorage.removeItem('userToken');
      }
    }
  }

  async function getUserByName(username: string) {
    const url = `${API_HOST}/users/${username}`;
    const result = await axios.get(url);

    const viewedUser = {...result.data, token: ''};
    setUserToView(viewedUser);
  }

  async function createUser(
    username: string, password: string,
    password2: string, rememberMe: boolean
  ) {
    const url = `${API_HOST}/users`;
    try {
      const result = await axios.post(url, { username, password, password2 });
      setIsLoggedIn(true);
      toggleRegistrationForm(false);
      setRegistrationError('');
      const token = result.headers.authorization;
      setUser({ ...result.data, token });
      if (rememberMe) localStorage.setItem('userToken', token);
    } catch (error) {
      setRegistrationError(error.response.data.error);
    }
  }

  const logoutUser = () => {
    setIsLoggedIn(false);
    setUser(defaultUser);
    setPostToEdit(-1);
    togglePostForm(false);
    localStorage.clear();
  }

  const sortPosts = (posts: Array<Post>) => {
    return posts.sort((post1: Post, post2: Post) => {
      let date1 = new Date(post1.creation_date);
      let date2 = new Date(post2.creation_date);
      return date1 < date2 ? 1 : -1;
    });
  };

  async function getAllPosts() {
    const url = `${API_HOST}/posts`;
    const result = await axios.get(url);
    const sortedPosts = sortPosts(result.data.posts);
    setPosts(sortedPosts);
  }

  async function createPost(title: string, body: string) {
    const url = `${API_HOST}/posts`;
    if (user.token !== '') {
      const result = await axios.post(
        url, { title, body }, { headers: { 'Authorization': `Bearer ${user.token}` }}
      );

      const newPost = result.data;
      const sortedPosts = sortPosts(posts.concat(newPost));
      setPosts(sortedPosts);

      togglePostForm(false);
    }
  }

  async function updatePost(oldId: number, title: string, body: string) {
    const url = `${API_HOST}/posts/${oldId}`;
    if (user.token !== '') {
      const result = await axios.put(
        url, { title, body }, { headers: { 'Authorization': `Bearer ${user.token}` } }
      );

      const sortedPosts = sortPosts(posts
        .filter((post: Post) => post.id !== oldId)
        .concat(result.data)
      );

      setPosts(sortedPosts);
      setPostToEdit(-1);
    }
  }

  async function deletePost(deletedPost: Post) {
    const url = `${API_HOST}/posts/${deletedPost.id}`;
    await axios.delete(
      url, { headers: {'Authorization': `Bearer ${user.token}`}}
    )

    const sortedPosts = sortPosts(posts
      .filter((post: Post) => post.id !== deletedPost.id)
    );

    setPosts(sortedPosts);
  }

  useEffect(() => {
    getAuthenticatedUser();
    getAllPosts();
  }, []);

  type PostRouteVars = { id: string };
  const SelectPost = ({ match, ...props }: RouteComponentProps<PostRouteVars>) => {
    const postId = match.params.id;
    const post = posts.find((post: Post) => post.id === parseInt(postId));
    const noMatchProps = { match, ...props};
    const detailProps = { post, user, beingEdited, setPostToEdit, updatePost, deletePost };
    return post ? <PostDetail {...detailProps} /> : <NoMatch {...noMatchProps} />;
  }

  type UserRouteVars = { username: string };
  const SelectUser = async ({ match, ...props }: RouteComponentProps<UserRouteVars>) => {
    const username = match.params.username;
    await getUserByName(username);
    const noMatchProps = { match, ...props};
    const detailProps = { user: userToView }
    return userToView !== defaultUser ? <UserDetail {...detailProps} /> : <NoMatch {...noMatchProps} />;
  }

  const headerProps = {
    isLoggedIn, logoutUser, toggleLoginForm, 
    togglePostForm, toggleRegistrationForm
  };
  const overlayProps = {
    displayLoginForm, displayPostForm, displayRegistrationForm,
    createPost, createUser, submitLogin, loginError,
    registrationError
  };

  return (
    <Router>
      <div className="App">
        <ForumHeader {...headerProps} />
        <Overlay {...overlayProps}/>
        <Switch>
          <Route path="/posts/:id" component={SelectPost} />
          <Route path="/:username" component={SelectUser} />
          <Route exact path="/" render={
            () => <PostList posts={ posts } />
          }/>
          <Route component={ NoMatch } />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
