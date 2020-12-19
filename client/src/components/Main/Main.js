import React, { useEffect } from 'react';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import AllCars from '../Car/AllCars'
import carImg from '../../assets/car.svg'

import classes from './Main.module.css'
import Header from '../../styles/Header/Header.module.css'
import Info from '../../styles/Info/Info.module.css'

const Main = () => {
  const username = useSelector(state => state.username)
  useEffect(() => { }, [username])
  return (
    <div className={classes.MainComponent}>
      {
        username !== ""
          ?
          <div className={classes.LoggedIn}>
            <AllCars username={username} />
          </div>
          :
          <div>
            <h1 className={Header.Main}>Car Expenses Application</h1>
            <div className={Info.Container}>
              <h1>Welcome!</h1>
              <p>this is a portfolio app to show</p>
              <p>React, Node and Mongodb CRUD</p>
              <br />
              <h3>Please login or signup</h3>
              <p>No need for email</p>
              <Link to="/login">
                <button>login</button>
              </Link>
              <Link to="signup">
                <button>signup</button>
              </Link>
            </div>
            <img className={classes.Icon} src={carImg} />
            <div className={classes.Credits}>
              <p>by Samuel Koskelainen</p>
              <p><a href="https://github.com/samuelkoskelainen/car-expenses-app">github</a></p>
            </div>
          </div>
      }
    </div>
  );
};

export default Main;