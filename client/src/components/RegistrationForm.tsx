import React, { useState, ChangeEvent, FormEvent } from 'react';

interface Props {
  createUser: (
    username: string,
    password: string,
    password2: string,
    rememberMe: boolean
  ) => {};
  registrationError?: string;
}

export const RegistrationForm = ({ createUser, registrationError }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const updateUsername = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  }
  const updatePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }
  const updatePassword2 = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword2(event.target.value);
  }
  const updateRememberMe = (event: ChangeEvent<HTMLInputElement>) => {
    setRememberMe(event.target.checked);
  }
  const submitUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createUser(username, password, password2, rememberMe);
    setPassword('');
    setPassword2('');
  }

  return <form onSubmit={submitUser}>
      {registrationError ? <div>{registrationError}</div> : null}
      <div>
          <label htmlFor="username">Username:</label>
          <input
              type="text" name="username"
              value={username} onChange={updateUsername}
          />
      </div>
      <div>
          <label htmlFor="password">Password:</label>
          <input
              type="password" name="password"
              value={password} onChange={updatePassword}
          />
      </div>
      <div>
          <label htmlFor="password2">Confirm Password:</label>
          <input
              type="password" name="password2"
              value={password2} onChange={updatePassword2}
          />
      </div>
      <div>
          <input
              type="checkbox" name="remember-me"
              checked={rememberMe} onChange={updateRememberMe}
          />
          <label htmlFor="remember-me">Remember me</label>
      </div>
      <div>
          <button type="submit">Create User</button>
      </div>
  </form>
}