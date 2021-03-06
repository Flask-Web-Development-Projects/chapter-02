import React, { FunctionComponent, useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, RouteComponentProps } from 'react-router-dom';

import { AuthUserDetail, UserDetail } from './components/users';
import { ForumHeader, NoMatch, Overlay } from './components/global';
import { PostDetail, PostList } from './components/posts';

import { Comment, Post, User, defaultUser } from './types';
import { API_HOST } from './util';

import './App.css';

const App: FunctionComponent = () => {
  const [ posts, setPosts ] = useState<Array<Post>>([]);
  const [ beingEdited, setPostToEdit ] = useState(-1);

  const [ isLoggedIn, setIsLoggedIn ] = useState(false);

  const [ displayConfirmUserDelete, toggleConfirmUserDelete ] = useState(false);
  const [ displayPostForm, togglePostForm ] = useState(false);
  const [ displayLoginForm, toggleLoginForm ] = useState(false);
  const [ displayRegistrationForm, toggleRegistrationForm ] = useState(false);
  
  const [ loginError, setLoginError ] = useState('');
  const [ registrationError, setRegistrationError ] = useState('');
  
  const [ user, setUser ] = useState<User>(defaultUser);

  useEffect(() => {
    getAuthenticatedUser();
    getAllPosts();
  }, []);

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

  async function updateUser(field: string, value: string) {
    const url = `${API_HOST}/users/${user.username}`;
    try {
      const storedToken = localStorage.getItem('userToken');

      const token = user.token === '' ?
        storedToken :
        user.token;

      const result = await axios.put(
        url,
        { [field] : value },
        { headers: { 'Authorization': `Bearer ${token}` }}
      );

      const responseToken = result.headers.authorization;

      if (storedToken && storedToken !== responseToken) {
        localStorage.setItem('userToken', responseToken);
      }
      setUser({ ...result.data });
      getAllPosts();
    } catch (error) {
      console.error(error);
    }
  }

  async function updateUserPass(oldPass: string, newPass: string, confirmPass: string) {
    const url = `${API_HOST}/users/${user.username}`;
    const storedToken = localStorage.getItem('userToken');
    const token = user.token === '' ?
      storedToken :
      user.token;

    await axios.put(
      url,
      { 
        password: oldPass,
        new_password: newPass,
        new_password2: confirmPass
      },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
  }

  async function deleteUser() {
    const url = `${API_HOST}/users/${user.username}`;
    const storedToken = localStorage.getItem('userToken');
    const token = user.token === '' ?
      storedToken :
      user.token;
    
    await axios.delete(
      url,
      { headers: { 'Authorization': `Bearer ${token}` }}
    );

    setUser(defaultUser);
    setIsLoggedIn(false);
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

  async function updatePostViews(thePost?: Post) {
    if (!thePost) return null;
    const url = `${API_HOST}/posts/${thePost.id}/views`;
    await axios.put(url);
  }

  async function likePost(thePost: Post, liked: boolean) {
    const url = `${API_HOST}/posts/${thePost.id}`;
    if (user.token !== '') {
      await axios.put(
        url, { liked }, { headers: { 'Authorization': `Bearer ${user.token}` } }
      );
      if (thePost.liked_by.includes(user.username) && !liked) {
        thePost.liked_by = thePost
          .liked_by
          .filter((name: string) => name !== user.username);
      } else if (!thePost.liked_by.includes(user.username) && liked) {
        thePost.liked_by = thePost
          .liked_by
          .concat(user.username);
      }
    }
  }

  async function deletePost(deletedPost: Post) {
    const url = `${API_HOST}/posts/${deletedPost.id}`;
    await axios.delete(
      url, { headers: {Authorization: `Bearer ${user.token}`} }
    );

    const sortedPosts = sortPosts(posts
      .filter((post: Post) => post.id !== deletedPost.id)
    );

    setPosts(sortedPosts);
  }

  async function createComment(parentPost: Post, commentBody: string) {
    const url = `${API_HOST}/posts/${parentPost.id}/comments`;
    const result = await axios.post(
      url,
      { body: commentBody },
      { headers: {Authorization: `Bearer ${user.token}`} }
    );

    const newComment = result.data;
    const updatedCommentList = parentPost.comments.concat(newComment);
    const updatedPost = Object.assign(
      {},
      parentPost,
      {comments: updatedCommentList}
    );

    const updatedPostList = posts
      .filter((post: Post) => post.id !== updatedPost.id)
      .concat(updatedPost);
    
    setPosts(sortPosts(updatedPostList));
  }

  async function deleteComment(parentPost: Post, commentId: number) {
    const url = `${API_HOST}/posts/${parentPost.id}/comments/${commentId}`;
    await axios.delete(url, { headers: { Authorization: `Bearer ${user.token}` }});

    const updatedCommentList = parentPost.comments
      .filter((comment: Comment) => comment.id !== commentId);
    const updatedPost = Object.assign(
      {},
      parentPost,
      { comments: updatedCommentList}
    );
    const updatedPostList = posts
      .filter((post: Post) => post.id !== updatedPost.id)
      .concat(updatedPost);
    
    setPosts(updatedPostList);
  }

  async function updateComment(
    parentPost: Post, commentId: number,
    commentBody: string
  ) {
    const url = `${API_HOST}/posts/${parentPost.id}/comments/${commentId}`;
    const result = await axios.put(
      url,
      {body: commentBody},
      { headers: { Authorization: `Bearer ${user.token}` } }
    );

    const updatedComment = result.data;
    const updatedCommentList = parentPost.comments.concat(updatedComment);
    const updatedPost = Object.assign(
      {},
      parentPost,
      { comments: updatedCommentList }
    );

    const updatedPostList = posts
      .filter((post: Post) => post.id !== updatedPost.id)
      .concat(updatedPost);

    setPosts(sortPosts(updatedPostList));
  }

  const headerProps = {
    isLoggedIn, logoutUser, toggleLoginForm, 
    togglePostForm, toggleRegistrationForm
  };
  const overlayProps = {
    displayConfirmUserDelete, displayLoginForm, 
    displayPostForm, displayRegistrationForm,
    createPost, createUser, deleteUser, submitLogin,
    loginError, registrationError, toggleConfirmUserDelete
  };
  const authUserDetailProps = {
    authUser: user, updateUser,
    updateUserPass, toggleConfirmUserDelete
  };

  type PostRouteVars = { id: string };
  const SelectPost = ({ match, ...props }: RouteComponentProps<PostRouteVars>) => {
    const postId = match.params.id;
    const post = posts.find((post: Post) => post.id === parseInt(postId));
    const noMatchProps = { match, ...props };
    const detailProps = {
      post, user, beingEdited, setPostToEdit,
      updatePost, deletePost, createComment, deleteComment,
      updateComment, updatePostViews, likePost
    };
    return post ? <PostDetail {...detailProps} /> : <NoMatch {...noMatchProps} />;
  }

  return (
    <Router>
      <div className="App">
        <ForumHeader {...headerProps} />
        <Overlay {...overlayProps}/>
        <Switch>
          <Route path="/posts/:id" component={SelectPost} />
          <Route path="/profile" render={
            () => <AuthUserDetail {...authUserDetailProps} />
          } />
          <Route path="/users/:username" component={UserDetail} />
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
