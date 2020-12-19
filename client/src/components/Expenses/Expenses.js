import React, { useEffect, useState } from 'react';
import axios from 'axios'
import DatePicker from 'react-datepicker'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import "react-datepicker/dist/react-datepicker.css";
import classes from './Expenses.module.css'
import Header from '../../styles/Header/Header.module.css'
import Info from '../../styles/Info/Info.module.css'

const Expenses = (props) => {
  const username = useSelector(state => state.username)
  useEffect(() => { }, [username])

  const [car, setCar] = useState(null)
  const carID = props.match.params.carID

  const [message, setMessage] = useState({
    repairMessage: "",
    insuranceMessage: "",
    ticketMessage: "",
    otherMessage: ""
  })
  const [errorMessage, setErrorMessage] = useState({
    repairErrorMessage: "",
    insuranceErrorMessage: "",
    ticketErrorMessage: "",
    otherErrorMessage: ""
  })

  const [fetchErrorMessage, setFetchErrorMessage] = useState("")

  const [repair, setRepair] = useState("")
  const [insurance, setInsurance] = useState("")
  const [ticket, setTicket] = useState("")
  const [other, setOther] = useState("")
  const [loading, setLoading] = useState(true)

  const [repairDate, setRepairDate] = useState(new Date())
  const [insuranceDate, setInsuranceDate] = useState(new Date())
  const [ticketDate, setTicketDate] = useState(new Date())
  const [otherDate, setOtherDate] = useState(new Date())

  useEffect(() => {
    setLoading(true)
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
          setFetchErrorMessage(error.response.data.errorMessage)
          setLoading(false)
        }
        if (result.response.status === 500) {
          setFetchErrorMessage(result.response.data.errorMessage)
          setLoading(false)
        } else {
          setFetchErrorMessage("No internet connection.")
          setLoading(false)
        }
      })
  }, [])

  const submitHandler = (event, typeOfExpense, dateOfExpense, cost) => {
    event.preventDefault()

    axios
      .post("https://car-expenses-app.herokuapp.com/set-expense", {
        typeOfExpense,
        dateOfExpense,
        cost,
        carID,
        carName: car.name,
        carBrand: car.brand,
        carModel: car.model,
        user: username
      })
      .then(result => {
        if (result.status === 201) {
          if (result.data.expenseType === "Repair") {
            setMessage({ repairMessage: result.data.message })
          } else if (result.data.expenseType === "Insurance") {
            setMessage({ insuranceMessage: result.data.message })
          } else if (result.data.expenseType === "Ticket") {
            setMessage({ ticketMessage: result.data.message })
          } else if (result.data.expenseType === "Other") {
            setMessage({ otherMessage: result.data.message })
          }
        }
      })
      .catch(error => {
        if (error.response.status === 500) {
          if (error.response.data.expenseType === "Repair") {
            setErrorMessage({ repairErrorMessage: error.response.data.errorMessage })
          } else if (error.response.data.expenseType === "Insurance") {
            setErrorMessage({ insuranceErrorMessage: error.response.data.errorMessage })
          } else if (error.response.data.expenseType === "Ticket") {
            setErrorMessage({ ticketErrorMessage: error.response.data.errorMessage })
          } else if (error.response.data.expenseType === "Other") {
            setErrorMessage({ otherErrorMessage: error.response.data.errorMessage })
          }
        } else {
          setCar(null)
          setFetchErrorMessage("No internet connection.")
        }
      })
  }

  return (
    <div className={classes.ExpenseContainer}>
      {
        loading
          ?
          <p></p>
          :
          car === null
            ?
            <div>
              <div className={Header.Normal}>
                <h3>ADDING EXPENSES</h3>
              </div>
              <div className={Info.Container}>
                <h3>{fetchErrorMessage}</h3>
              </div>
            </div>
            :
            <div>
              <div className={Header.Normal}>
                <h3>ADDING EXPENSES FOR</h3>
                <p><strong>Brand</strong>: {car.brand}</p>
                <p><strong>Model</strong>: {car.model}</p>
                <p><strong>Name</strong>: {car.name}</p>
              </div>
              <div className={Info.Container}>
                <h3>Got expenses added?</h3>
                <p>You can see your report here.</p>
                <Link to={"/report/" + carID}>
                  <button>to report</button>
                </Link>
              </div>
              <div className={classes.InputRowHeader}>
                <h1>ADD EXPENSES</h1>
              </div>
              <form onSubmit={(event) => {
                submitHandler(event, "Repair", repairDate, repair)
                setRepair("")
              }}>
                <div className={classes.InputRow}>
                  <p>Repair expense</p>
                  <input
                    required
                    type="number"
                    placeholder="repair expense"
                    className={classes.Input}
                    onChange={event => setRepair(event.target.value)}
                    value={repair}
                  />
                  <DatePicker
                    selected={repairDate}
                    onChange={date => setRepairDate(date)}
                  />
                  <button className={classes.InputRowButton} type="submit">add repair expense</button>
                  {
                    message.repairMessage !== ""
                      ?
                      <p className={classes.Message}>{message.repairMessage}</p>
                      :
                      <p className={classes.ErrorMessage}>{errorMessage.repairErrorMessage}</p>
                  }
                </div>
              </form>

              <form onSubmit={(event) => {
                submitHandler(event, "Insurance", insuranceDate, insurance)
                setInsurance("")
              }
              }>
                <div className={classes.InputRow}>
                  <p>Insurance expense</p>
                  <input
                    required
                    type="number"
                    placeholder="insurance expense"
                    className={classes.Input}
                    onChange={event => setInsurance(event.target.value)}
                    value={insurance}
                  />
                  <DatePicker
                    selected={insuranceDate}
                    onChange={date => setInsuranceDate(date)}
                  />
                  <button className={classes.InputRowButton} type="submit">add insurance expense</button>
                  {
                    message.insuranceMessage !== ""
                      ?
                      <p className={classes.Message}>{message.insuranceMessage}</p>
                      :
                      <p className={classes.ErrorMessage}>{errorMessage.insuranceErrorMessage}</p>
                  }
                </div>
              </form>

              <form onSubmit={(event) => {
                submitHandler(event, "Ticket", ticketDate, ticket)
                setTicket("")
              }
              }>
                <div className={classes.InputRow}>
                  <p>Ticket expense</p>
                  <input
                    required
                    type="number"
                    placeholder="ticket expense"
                    className={classes.Input}
                    onChange={event => setTicket(event.target.value)}
                    value={ticket}
                  />
                  <DatePicker
                    selected={ticketDate}
                    onChange={date => setTicketDate(date)}
                  />
                  <button className={classes.InputRowButton} type="submit">add ticket expense</button>
                  {
                    message.ticketMessage !== ""
                      ?
                      <p className={classes.Message}>{message.ticketMessage}</p>
                      :
                      <p className={classes.ErrorMessage}>{errorMessage.ticketErrorMessage}</p>
                  }
                </div>
              </form>

              <form onSubmit={(event) => {
                submitHandler(event, "Other", otherDate, other)
                setOther("")
              }
              }>
                <div className={classes.InputRow}>
                  <p>Other expense</p>
                  <input
                    required
                    type="number"
                    placeholder="other expense"
                    className={classes.Input}
                    onChange={event => setOther(event.target.value)}
                    value={other}
                  />
                  <DatePicker
                    selected={otherDate}
                    onChange={date => setOtherDate(date)}
                  />
                  <button className={classes.InputRowButton} type="submit">add other expense</button>
                  {
                    message.otherMessage !== ""
                      ?
                      <p className={classes.Message}>{message.otherMessage}</p>
                      :
                      <p className={classes.ErrorMessage}>{errorMessage.otherErrorMessage}</p>
                  }
                </div>
              </form>
            </div>
      }
    </div>
  );
};

export default Expenses;