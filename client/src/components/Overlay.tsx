import React from 'react';
import { CreatePostForm } from './PostCreateForm';
import { LoginForm } from './LoginForm';
import { RegistrationForm } from './RegistrationForm';

interface Props {
  displayLoginForm: boolean;
  displayPostForm: boolean;
  displayRegistrationForm: boolean;
  createPost: (title: string, body: string) => {};
  createUser: (username: string, password: string, password2: string, rememberMe: boolean) => {};
  submitLogin: (username: string, password: string, rememberMe: boolean) => {};
  loginError: string;
  registrationError: string;
}

export const Overlay = ({
  displayLoginForm,
  displayPostForm,
  displayRegistrationForm,
  createPost, createUser, submitLogin, loginError,
  registrationError
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
  </section>
}