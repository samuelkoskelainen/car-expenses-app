import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import classes from './Car.module.css'
import Header from '../../styles/Header/Header.module.css'
import Info from '../../styles/Info/Info.module.css'

const Car = () => {
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [name, setName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [created, setCreated] = useState(false)
  const [message, setMessage] = useState('')
  const username = useSelector(state => state.username)

  useEffect(() => { }, [username, brand])
  const submitHandler = (event) => {
    event.preventDefault()
    axios
      .post("https://car-expenses-app.herokuapp.com/car-submit", { brand, model, name, user: username })
      .then(result => {
        if (result.status === 201) {
          setBrand('')
          setModel('')
          setName('')
          setCreated(true)
          setMessage(result.data.message)
        }
      })
      .catch(error => {
        if (error.response.status === 500) {
          setErrorMessage(error.response.data.errorMessage)
        } else {
          setErrorMessage("No internet connection.")
        }
      })
  }

  return (
    <>
      <div className={Header.Normal}>
        <h1>Adding a car</h1>
        <p><strong>setup one or many cars.</strong></p>
      </div>
      <div className={Info.Container}>
        <h3>Got your car created?</h3>
        <p>You can see it on your garage.</p>
        <Link to="/">
          <button>to garage</button>
        </Link>
      </div>
      <form id="car-setup" onSubmit={event => submitHandler(event)} />
      <div className={classes.InputContainer}><h1>ADD A CAR</h1></div>
      <div className={classes.InputContainer}>
        <div className={classes.InputColumn}>
          <p>Car brand</p>
          <input
            required
            type="text"
            form="car-setup"
            placeholder="Brand"
            className={classes.Input}
            onChange={event => setBrand(event.target.value)}
            value={brand}
          />
        </div>
        <div className={classes.InputColumn}>
          <p>Car model</p>
          <input
            required
            type="text"
            form="car-setup"
            placeholder="Model"
            className={classes.Input}
            onChange={event => setModel(event.target.value)}
            value={model}
          />
        </div>
        <div className={classes.InputColumn}>
          <p>Name your car</p>
          <input
            required
            type="text"
            form="car-setup"
            placeholder="Name"
            className={classes.Input}
            onChange={event => setName(event.target.value)}
            value={name}
          />
        </div>
        {
          created
            ?
            <p className={Info.Message}>{message}</p>
            :
            <p className={Info.ErrorMessage}>{errorMessage}</p>
        }
        <button
          type="submit"
          form="car-setup"
          className={classes.ToAddCarButton}
        >create Car</button>
      </div>
    </ >
  );
};

export default Car;