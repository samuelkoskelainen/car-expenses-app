import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import axios from 'axios'
import PieChart from './PieChart/PieChart'
import { Link } from 'react-router-dom'

import classes from './Report.module.css'
import Info from '../../styles/Info/Info.module.css'
import Header from '../../styles/Header/Header.module.css'

const Raport = (props) => {
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expenses, setExpenses] = useState(null)
  const [sortedCostByType, setSortedCostByType] = useState(null)
  const [allCostsCombined, setAllCostCombined] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const username = useSelector(state => state.username)
  const carID = props.match.params.carID

  useEffect(() => {
    axios
      .get(`https://car-expenses-app.herokuapp.com/get-expenses/${carID}/${username}`)
      .then(result => {
        if (result.status === 200) {
          if (result.data.expenses.length !== 0) {
            setSortedCostByType(result.data.sortedCostByType)
            setAllCostCombined(result.data.allCostsCombined[0].cost)
            setExpenses(result.data.expenses)
          }
        }
      })
      .catch(error => {
        if (error.response.status === 404) {
          setErrorMessage(error.response.data.errorMessage)
        } else {
          setErrorMessage("No internet connection.")
          setLoading(false)
        }
      })

    axios
      .get(`https://car-expenses-app.herokuapp.com/get-one-car/${carID}`)
      .then(result => {
        if (result.status === 200) {
          setCar(result.data.car)
          setLoading(false)
        }
      })
      .catch(error => {
        if (error.response.status === 404) {
          setErrorMessage(error.response.data.errorMessage)
          setLoading(false)
        }
        if (error.response.status === 500) {
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
      {
        loading
          ?
          <p></p>
          :
          expenses && sortedCostByType && allCostsCombined
            ?
            <div>
              <div className={classes.RaportContainer}>
                <h1>Report for {expenses[0].carName}</h1>
                <p>Brand: {expenses[0].carBrand}</p>
                <p>Model: {expenses[0].carModel}</p>
                <br />
                <PieChart data={sortedCostByType} />
                <br />
                <div className={classes.DottedLine}></div>
                <h3>By expense type</h3>
                {
                  sortedCostByType.map((expense, index) => {
                    return (
                      <p key={index}><strong>{expense.typeOfExpense ? expense.typeOfExpense : null}</strong>{expense.cost ? ", " + expense.cost + "€" : null}</p>
                    )
                  })
                }
                <div className={classes.DottedLine}></div>
                <h3>Expenses combined</h3>
                <p><strong>Total: </strong>{allCostsCombined}€</p>
              </div>
              <div>
              </div>
              <div className={Info.Container}>
                <h3>Do you have more expenses to this car?</h3>
                <p>You can add more and the report will update.</p>
                <Link to={"/set-expenses/" + carID}>
                  <button>add expenses</button>
                </Link>
              </div>
              <div className={Info.Container}>
                <h3>Did you type something wrong?</h3>
                <p>you can edit or delete any expense and the report will update.</p>
                <Link to={"/edit-expenses/" + carID}>
                  <button>edit expenses</button>
                </Link>
              </div>
            </div>
            :
            <div>
              {
                car !== null
                  ?
                  <div>
                    <div className={Header.Normal}>
                      <h1>Raport for {car.name}</h1>
                      <p>Brand: {car.brand}</p>
                      <p>Model: {car.model}</p>
                    </div>
                    <div className={Info.Container}>
                      <h3>Slow down!</h3>
                      <p>Please set expenses first.</p>
                      <Link to={"/set-expenses/" + carID}>
                        <button>set expenses</button>
                      </Link>
                    </div>
                  </div>
                  :
                  <div>
                    <div className={Header.Normal}>
                      <h1>Report</h1>
                      <p>Analysis of your expenses</p>
                    </div>
                    <div className={Info.Container}>
                      <h3>{errorMessage}</h3>
                    </div>
                  </div>
              }
            </div>
      }
    </div >
  );
};

export default Raport; 