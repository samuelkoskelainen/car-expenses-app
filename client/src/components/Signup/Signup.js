import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'

import Header from '../../styles/Header/Header.module.css'
import CredentialContainer from '../../styles/CredentialContainer/CredentialContainer.module.css'

const Signup = () => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const newRoute = useHistory()
  const dispatch = useDispatch()


  const submitHandler = (event) => {
    event.preventDefault()
    if (password === password2) {
      const passwordvalidator = /^(?=.*\d)(?=.*[.!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
      if (passwordvalidator.test(password) === false) {
        setErrorMessage("password not strong enough")
        setPassword('')
        setPassword2('')
      } else {
        axios
          .post("https://car-expenses-app.herokuapp.com/user-signup", { name, password })
          .then(result => {
            console.log(result.status)
            if (result.status === 200) {
              sessionStorage.setItem("username", result.data.username)
              dispatch({ type: "SET-USERNAME", payload: sessionStorage.getItem("username") })
              setName('')
              setPassword('')
              newRoute.push('/')
            }
          })
          .catch(error => {
            if (error.response.status === 500) {
              setErrorMessage(error.response.data.errorMessage)
              setName('')
              setPassword('')
              setPassword2('')
            }
            if (error.response.status === 409) {
              setErrorMessage(error.response.data.errorMessage)
              setName('')
              setPassword('')
              setPassword2('')
            } else {
              setErrorMessage("No internet connection")
            }
          })
      }
    } else {
      setErrorMessage("passwords did not match!")
      setPassword('')
      setPassword2('')
    }
  }


  return (
    <>
      <div className={Header.Normal}>
        <h1>Signup</h1>
        <h3>Create a new user</h3>
      </div>
      <form id="signup" onSubmit={event => submitHandler(event)} />
      <div className={CredentialContainer.InputContainer}>
        <div className={CredentialContainer.InputRow}>
          <p>username</p>
          <input
            required
            type="text"
            form="signup"
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
            form="signup"
            placeholder="password"
            value={password}
            className={CredentialContainer.Input}
            onChange={event => setPassword(event.target.value)}
          />
        </div>
        <div className={CredentialContainer.InputRow}>
          <p>confirm password</p>
          <input
            required
            type="password"
            form="signup"
            placeholder="password"
            value={password2}
            className={CredentialContainer.Input}
            onChange={event => setPassword2(event.target.value)}
          />
        </div>
        <p className={CredentialContainer.Error}>{errorMessage}</p>
        <button className={CredentialContainer.SignupButton} type="submit" form="signup">signup</button>
        <br />
        <div className={CredentialContainer.PasswordValidContainer}>
          <p>password length atleast 8 and must include:</p>
          <p><strong>lowercase character</strong></p>
          <p><strong>uppercase character</strong></p>
          <p><strong>symbol: </strong>" .!@#$%^&* "</p>
          <p><strong>number</strong></p>
        </div>
      </div>
    </>
  );
};

export default Signup;