import React, { Dispatch, SetStateAction } from 'react';
import { ConfirmUserDelete } from './ConfirmUserDelete';
import { CreatePostForm } from './PostCreateForm';
import { LoginForm } from './LoginForm';
import { RegistrationForm } from './RegistrationForm';

interface Props {
  displayConfirmUserDelete: boolean;
  displayLoginForm: boolean;
  displayPostForm: boolean;
  displayRegistrationForm: boolean;
  deleteUser: () => {};
  createPost: (title: string, body: string) => {};
  createUser: (username: string, password: string, password2: string, rememberMe: boolean) => {};
  submitLogin: (username: string, password: string, rememberMe: boolean) => {};
  loginError: string;
  registrationError: string;
  toggleConfirmUserDelete: Dispatch<SetStateAction<boolean>>;
}

export const Overlay = ({
  displayConfirmUserDelete,
  displayLoginForm,
  displayPostForm,
  displayRegistrationForm,
  deleteUser,
  createPost, createUser, submitLogin, loginError,
  registrationError,
  toggleConfirmUserDelete
}: Props) => {
  const loginProps = { onSubmit: submitLogin, loginError };
  const postFormProps = { createPost };
  const registrationProps = { createUser, registrationError };

  return <section id="overlay">
    {
      displayPostForm ?
        <CreatePostForm {...postFormProps} /> : null
    }
    {
      displayLoginForm ?
        <LoginForm {...loginProps} /> : null
    }
    {
      displayRegistrationForm ?
        <RegistrationForm {...registrationProps} /> : null
    }
    {
      displayConfirmUserDelete ?
        <ConfirmUserDelete
          deleteUser={deleteUser}
          toggleConfirmUserDelete={toggleConfirmUserDelete}
        /> : null
    }
  </section>
}