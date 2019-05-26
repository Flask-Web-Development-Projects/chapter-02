import React, { FunctionComponent, useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, RouteComponentProps, Link } from 'react-router-dom';

import { CreatePostForm } from './components/CreatePostForm';
import { LoginForm } from './components/LoginForm';
import { PostDetail } from './components/PostDetail';
import { PostList } from './components/PostList';
import { RegistrationForm } from './components/RegistrationForm';
import { NoMatch } from './components/NoMatch';

import { Post, User, defaultUser } from './types';

import './App.css';

const API_HOST = `${process.env.REACT_APP_API_HOST || "http://localhost:5000"}/api/v1`;

const App: FunctionComponent = () => {
  const [ posts, setPosts ] = useState<Array<Post>>([]);

  const [ isLoggedIn, setIsLoggedIn ] = useState(false);

  const [ displayPostForm, togglePostForm ] = useState(false);
  const [ displayLoginForm, toggleLoginForm ] = useState(false);
  const [ displayRegistrationForm, toggleRegistrationForm ] = useState(false);
  
  const [ loginError, setLoginError ] = useState('');
  const [ registrationError, setRegistrationError ] = useState('');
  
  const [ user, setUser ] = useState<User>(defaultUser);

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

  async function getUser() {
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

  useEffect(() => {
    getUser();
    getAllPosts();
  }, []);

  type RouteVars = { id: string };
  const SelectPost = ({ match, ...props }: RouteComponentProps<RouteVars>) => {
    const postId = match.params.id;
    const post = posts.find((post: Post) => post.id === parseInt(postId));
    const noMatchProps = { match, ...props};
    return post ? <PostDetail post={ post }/> : <NoMatch {...noMatchProps} />;
  }

  const loginProps = { onSubmit: submitLogin, loginError };
  const registrationProps = { createUser, registrationError };
  const postFormProps = { createPost };

  return (
    <Router>
      <div className="App">
        <section>
          <Link to="/">
            <h1>Flask Forum</h1>
          </Link>
          { 
            isLoggedIn ?
            <>
              <button onClick={ () => togglePostForm(true) }>Create Post</button>
            </>:
            <>
              <button onClick={ () => {
                toggleLoginForm(true);
                toggleRegistrationForm(false);
              } }>Login</button>
              <button onClick={ () => {
                toggleLoginForm(false);
                toggleRegistrationForm(true);
              } }>Register</button>
            </>
          }
        </section>
        <section id="overlay">
          {
            displayLoginForm ?
            <LoginForm {...loginProps} /> :
            null
          }
          {
            displayRegistrationForm ?
            <RegistrationForm {...registrationProps} /> :
            null
          }
          {
            displayPostForm ?
            <CreatePostForm {...postFormProps} /> :
            null
          }
        </section>
        <Switch>
          <Route path="/posts/:id" component={SelectPost} />
          <Route exact path="/" render={() => <PostList posts={ posts } />}/>
          <Route component={ NoMatch } />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
