import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Edit from './Edit'

import classes from './Expenses.module.css'
import Header from '../../styles/Header/Header.module.css'
import Info from '../../styles/Info/Info.module.css'

const EditExpenses = (props) => {
  const [car, setCar] = useState(null)
  const [editExpenses, setEditExpenses] = useState(null)
  const [expensesLength, setExpensesLength] = useState(0)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  const handleExpenseDelete = () => {
    setExpensesLength(expensesLength - 1)
    if (expensesLength <= 0) {
      setEditExpenses(null)
    }
  }

  const username = useSelector(state => state.username)
  const carID = props.match.params.carID

  useEffect(() => {
    axios
      .get(`https://car-expenses-app.herokuapp.com/get-expenses/${carID}/${username}`)
      .then(result => {
        if (result.status === 404) {
          setExpensesLength(0)
          setErrorMessage(result.data.errorMessage)
        }
        if (result.status === 200) {
          if (result.data.expenses.length !== 0) {
            setExpensesLength(result.data.expenses.length - 1)
            setEditExpenses(result.data.expenses)
          } else {
            setEditExpenses(null)
          }
        }
      })
      .catch(error => {
        setErrorMessage("No internet connection.")
        setLoading(false)
      })

    axios
      .get(`https://car-expenses-app.herokuapp.com/get-one-car/${carID}`)
      .then(result => {
        if (result.status === 404) {
          setErrorMessage(result.data.errorMessage)
          setLoading(false)
        }
        if (result.status === 500) {
          setErrorMessage(result.data.errorMessage)
          setLoading(false)
        }
        if (result.status === 200) {
          setCar(result.data.car)
          setLoading(false)
        }
      })
      .catch(error => {
        setErrorMessage("No internet connection.")
        setLoading(false)
      })
  }, [])

  return (
    loading
      ?
      <p></p>
      :
      <div>
        {
          car
            ?
            <div>
              <div className={Header.Normal}>
                <h3>EDITING EXPENSES FOR</h3>
                <p><strong>Brand</strong>: {car.brand}</p>
                <p><strong>Model</strong>: {car.model}</p>
                <p><strong>Name</strong>: {car.name}</p>
              </div>
            </div>
            :
            <div>
              <div>
                <div className={Header.Normal}>
                  <h3>EDITING EXPENSES</h3>
                  <p>Edit your cars expenses</p>
                </div>
                <div className={Info.Container}>
                  <h3>{errorMessage}</h3>
                </div>
              </div>
            </div>
        }
        {
          editExpenses
            ?
            <div>
              <div className={Info.Container}>
                <h3>Got expenses edited?</h3>
                <p>You can see your report here.</p>
                <Link to={"/report/" + carID}>
                  <button>to report</button>
                </Link>
              </div>
              <div>
                <div className={classes.InputRowHeader}>
                  <h1>EDIT EXPENSES</h1>
                </div>
                <div>
                  {
                    editExpenses.map((expense, index) => {
                      return (
                        <Edit expense={expense} key={index} username={username} expenseDelete={handleExpenseDelete} />
                      )
                    })
                  }
                </div>
              </div>
            </div>
            :
            <div>
              <div className={Info.Container}>
                <h3>No expenses</h3>
                <p>You can set expenses here.</p>
                <Link to={"/set-expenses/" + carID}>
                  <button>set expenses</button>
                </Link>
              </div>
            </div>
        }
      </div>
  );
};

export default EditExpenses;