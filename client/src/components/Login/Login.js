import React, { useState } from 'react';
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import Header from '../../styles/Header/Header.module.css'
import CredentialContainer from '../../styles/CredentialContainer/CredentialContainer.module.css'

const Login = () => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const newRoute = useHistory()
  const dispatch = useDispatch()

  const submitHandler = (event) => {
    event.preventDefault()
    axios
      .post("https://car-expenses-app.herokuapp.com/user-login", { name, password })
      .then(result => {
        if (result.status === 200) {
          sessionStorage.setItem("username", result.data.username)
          dispatch({ type: "SET-USERNAME", payload: sessionStorage.getItem("username") })
          setName('')
          setPassword('')
          newRoute.push('/')
        }
      })
      .catch(error => {
        if (error.response.status === 409) {
          setErrorMessage(error.response.data.errorMessage)
          setName('')
          setPassword('')
        } else {
          setErrorMessage("No internet connection.")
        }
      })
  }

  return (
    <>
      <form id="login" onSubmit={event => submitHandler(event)} />
      <div className={Header.Normal}>
        <h1>Login</h1>
        <h3>Type username and password</h3>
      </div>
      <div className={CredentialContainer.InputContainer}>
        <div className={CredentialContainer.InputRow}>
          <p>username</p>
          <input
            required
            type="text"
            form="login"
            placeholder="username"
            value={name}
            className={CredentialContainer.Input}
            onChange={event => setName(event.target.value)}
          />
        </div>
        <div className={CredentialContainer.InputRow}>
          <p>password</p>
          <input
            required
            type="password"
            form="login"
            placeholder="password"
            value={password}
            className={CredentialContainer.Input}
            onChange={event => setPassword(event.target.value)}
          />
          <p className={CredentialContainer.Error}>{errorMessage}</p>
          <button className={CredentialContainer.LoginButton} type="submit" form="login">login</button>
        </div>
      </div>
    </>
  );
};

export default Login;