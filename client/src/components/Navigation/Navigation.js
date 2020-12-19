import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'

import classes from './Navigation.module.css'

const Navigation = () => {
  const username = useSelector(state => state.username)
  const [burgerActive, setBurgerActive] = useState(false)
  const [logoutActive, setLogoutActive] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => { }, [username])

  const handleLogout = () => {
    setLogoutActive(false)
    sessionStorage.removeItem("username")
    dispatch({ type: "SET-USERNAME", payload: "" })
    history.push("/")
  }

  const burgerPress = () => {
    setLogoutActive(false)
    setBurgerActive(!burgerActive)
  }

  const logoutPress = () => {
    setBurgerActive(false)
    setLogoutActive(!logoutActive)
  }

  return (
    <div className={classes.CreateMargin}>
      <div className={classes.NavBar}>
        {
          username !== ""
            ?
            <div className={classes.LoggedIn}>
              <button className={classes.Burger} onClick={() => burgerPress()}>
                <span className={burgerActive ? classes.Line1Active : classes.Line1}></span>
                <span className={burgerActive ? classes.Line2Active : classes.Line2}></span>
                <span className={burgerActive ? classes.Line3Active : classes.Line3}></span>
              </button>
              <Link to="/">
                <button>garage</button>
              </Link>
              <button onClick={() => logoutPress()}>logout</button>
            </div>
            :
            <div className={classes.NotLoggedIn}>
              <Link to="/login">
                <button>login</button>
              </Link>
              <Link to="/signup">
                <button>signup</button>
              </Link>
            </div>
        }
      </div>
      {
        burgerActive || logoutActive
          ?
          <div className={classes.BackgroundBlur} onClick={() => {
            setBurgerActive(false)
            setLogoutActive(false)
          }}></div>
          :
          null
      }
      <div className={burgerActive ? classes.DropDownMenuActive : classes.DropDownMenu}>
        <button className={classes.DropDownMenuButtonUserName}>{username}</button>
        <button className={classes.DropDownMenuButton}>App by Samuel Koskelainen</button>
        <a href="https://github.com/samuelkoskelainen/car-expenses-app">
          <button className={classes.DropDownMenuButtonLink} onClick={() => {
            setLogoutActive(false)
            setBurgerActive(false)
          }}>checkout github</button>
        </a>
      </div>
      <div className={logoutActive ? classes.LogoutMenuActive : classes.LogoutMenu}>
        <button className={classes.BackToApp} onClick={() => setLogoutActive(false)}>BACK TO THE APP</button>
        <button className={classes.FinalLogout} onClick={handleLogout}>LOGOUT</button>
      </div>
    </div>
  );
};

export default Navigation;