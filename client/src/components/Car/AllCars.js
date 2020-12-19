import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom'

import classes from './Car.module.css'
import Header from '../../styles/Header/Header.module.css'
import Info from '../../styles/Info/Info.module.css'

const AllCars = ({ username }) => {
  const [cars, setCars] = useState(null)
  const [noCars, setNoCars] = useState(false)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    axios
      .get(`https://car-expenses-app.herokuapp.com/get-all-cars/${username}`)
      .then(result => {
        if (result.status === 200) {
          setCars(result.data.cars)
          setLoading(false)
        }
      })
      .catch(error => {
        if (error.response.status === 404) {
          setNoCars(true)
          setErrorMessage(error.response.data.errorMessage)
          setLoading(false)
        } else {
          setErrorMessage("No internet connection.")
          setLoading(false)
        }
      })
  }, [])

  return (
    <div>
      <div className={Header.Normal}>
        <h1>Garage</h1>
        <p><strong>A collection of your cars.</strong></p>
      </div>
      {
        loading
          ?
          null
          :
          cars !== null
            ?
            <div>
              <div className={classes.CreateCarContainer}>
                <h3>Have another car?</h3>
                <p>Let's get that one setup as well!</p>
                <Link to="/car-setup">
                  <button className={classes.CreateCarButton}>car setup</button>
                </Link>
              </div>
              <div className={classes.CarCardHeader}>
                <h1>GARAGE</h1>
              </div>
              {
                cars.map((car, index) => {
                  return (
                    <div key={index} className={classes.CarCard}>
                      <h1>{car.name}</h1>
                      <p>Brand: {car.brand}</p>
                      <p>Model: {car.model}</p>
                      <div className={classes.CarCardButtonContainer}>
                        <Link to={"/set-expenses/" + car._id}>
                          <button className={classes.CarCardButton}>expenses</button>
                        </Link>
                        <Link to={"/report/" + car._id}>
                          <button className={classes.CarCardButton}>report</button>
                        </Link>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            :
            noCars
              ?
              <div className={Info.Container}>
                <h2>Looking a bit empty in here...</h2>
                <p>Start by setting up your car</p>
                <Link to="/car-setup">
                  <button>to car setup</button>
                </Link>
              </div>
              :
              <div className={Info.Container}>
                <h2>{errorMessage}</h2>
              </div>
      }
    </div>
  );
};

export default AllCars;