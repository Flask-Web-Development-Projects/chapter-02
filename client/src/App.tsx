import React, { FunctionComponent, useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { PostList } from './components/PostList';
import { NoMatch } from './components/NoMatch';
import { Post } from './types';
import './App.css';

const API_HOST = `${process.env.REACT_APP_API_HOST || "http://localhost:5000"}/api/v1`;

const App: FunctionComponent = () => {
  const [ posts, setPosts ] = useState<Array<Post>>([]);

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

  useEffect(() => {
    getAllPosts();
  }, []);

  console.log(posts);
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route
            exact path="/"
            render={() => <PostList posts={ posts } />}
          />
          <Route component={ NoMatch } />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
