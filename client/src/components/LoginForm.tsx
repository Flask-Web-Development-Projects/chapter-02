import React, { useState, ChangeEvent, FormEvent } from 'react';

interface Props {
    onSubmit: (username: string, password: string, rememberMe: boolean) => {};
    loginError?: string;
}

export const LoginForm = ({ onSubmit, loginError }: Props) => {
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ rememberMe, setRememberMe ] = useState(false);

    const updateUsername = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    }
    const updatePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }
    const updateRememberMe = (event: ChangeEvent<HTMLInputElement>) => {
        setRememberMe(event.target.checked);
    }
    const submitLogin = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(username, password, rememberMe);
        setPassword('');
    }

    return <form onSubmit={ submitLogin }>
        {loginError ? <div>{loginError}</div> : null}
        <div>
            <label htmlFor="username">Username:</label>
            <input
                type="text" name="username"
                value={ username } onChange={ updateUsername }
            />
        </div>
        <div>
            <label htmlFor="password">Password:</label>
            <input
                type="password" name="password"
                value={ password } onChange={ updatePassword }
            />
        </div>
        <div>
            <input
                type="checkbox" name="remember-me"
                checked={ rememberMe } onChange={ updateRememberMe }
            />
            <label htmlFor="remember-me">Remember me</label>
        </div>
        <div>
            <button type="submit">Log In</button>
        </div>
    </form>
}