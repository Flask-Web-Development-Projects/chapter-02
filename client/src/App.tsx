import React, { FunctionComponent, useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { PostList } from './components/PostList';
import { NoMatch } from './components/NoMatch';
import { Post } from './types';
import './App.css';
import { LoginForm } from './components/LoginForm';

const API_HOST = `${process.env.REACT_APP_API_HOST || "http://localhost:5000"}/api/v1`;

const App: FunctionComponent = () => {
  const [ posts, setPosts ] = useState<Array<Post>>([]);
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [ displayLoginForm, toggleLoginForm ] = useState(false);
  const [ loginError, setLoginError ] = useState('');
  const [ user, setUser ] = useState(null);

  async function getAllPosts() {
    const url = `${API_HOST}/posts`;
    const result = await axios.get(url);

    setPosts(result.data.posts
      .sort((post1: Post, post2: Post) => {
        let date1 = new Date(post1.creation_date);
        let date2 = new Date(post2.creation_date);
        return date1 > date2 ? 1 : -1;
      })
    );
  }

  async function submitLogin(username: string, password: string, rememberMe: boolean) {
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

  useEffect(() => {
    getUser();
    getAllPosts();
  }, []);

  console.log(posts);
  return (
    <Router>
      <div className="App">
        <section>
          <h1>Flask Forum</h1>
          { 
            isLoggedIn ?
            null :
            <button onClick={ () => toggleLoginForm(true)}>Login</button>
          }
        </section>
        { 
          displayLoginForm ?
          <section id="overlay">
            <LoginForm
              onSubmit={ submitLogin }
              loginError={ loginError }
            />
          </section> :
          null
        }
        <Switch>
          <Route exact path="/" render={() => <PostList posts={ posts } />}/>
          <Route component={ NoMatch } />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
