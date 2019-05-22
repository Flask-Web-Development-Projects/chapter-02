import React, { FunctionComponent, useState, useEffect } from 'react';
import axios from 'axios';

import { Post } from './types';
import './App.css';

const API_HOST = `${process.env.REACT_APP_API_HOST || "http://localhost:5000"}/api/v1`;

const App: FunctionComponent = () => {
  const [ posts, setPosts ] = useState<Array<Post>>([]);

  async function getAllPosts() {
    const url = `${API_HOST}/posts`;
    const result = await axios.get(url);

    setPosts(result.data.posts);
  }

  useEffect(() => {
    getAllPosts();
  }, []);

  console.log(posts);
  return (
    <div className="App">
      {posts.map((post: Post) => {
        return <div>
          <header>{post.title}</header>
          <p>{post.body}</p>
        </div>;
      })}
    </div>
  );
}

export default App;
