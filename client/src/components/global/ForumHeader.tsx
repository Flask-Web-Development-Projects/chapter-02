import React, { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  isLoggedIn: boolean;
  logoutUser: () => void;
  toggleLoginForm: Dispatch<SetStateAction<boolean>>;
  togglePostForm: Dispatch<SetStateAction<boolean>>;
  toggleRegistrationForm: Dispatch<SetStateAction<boolean>>;
}

export const ForumHeader = ({
  isLoggedIn,
  logoutUser,
  toggleLoginForm,
  togglePostForm,
  toggleRegistrationForm
}: Props) => {
  return <section>
    <Link to="/">
      <h1>Flask Forum</h1>
    </Link>
    {
      isLoggedIn ?
      <>
        <button onClick={() => togglePostForm(true)}>Create Post</button>
        <button onClick={logoutUser}>Logout</button>
      </> :
      <>
        <button onClick={() => {
          toggleLoginForm(true);
          toggleRegistrationForm(false);
        }}>Login</button>
        <button onClick={() => {
          toggleLoginForm(false);
          toggleRegistrationForm(true);
        }}>Register</button>
      </>
    }
  </section>
}