import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker'
import axios from 'axios'

import classes from './Expenses.module.css'
import Info from '../../styles/Info/Info.module.css'
import "react-datepicker/dist/react-datepicker.css";

const Edit = ({ expense, expenseDelete }) => {
  const [dateText, setDateText] = useState(expense.dateOfExpense)
  const [costText, setCostText] = useState(expense.cost)

  const [date, setDate] = useState(new Date(expense.dateOfExpense))
  const [cost, setCost] = useState(expense.cost)

  const [updateMode, setUpdateMode] = useState(false)
  const [updateBtnText, setUpdateBtnText] = useState("open editor")

  const [updateMessage, setUpdateMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [deleteMessage, setDeleteMessage] = useState("")

  const [deleted, setDeleted] = useState(false)
  const [cleanOut, setCleanOut] = useState(false)

  const updateMsgTimer = (message) => {
    setUpdateMessage(message)
    setTimeout(() => {
      if (cleanOut !== true) {
        setUpdateMessage("")
      }
    }, 5000)
  }

  const errorMsgTimer = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      if (cleanOut !== true) {
        setErrorMessage("")
      }
    }, 5000)
  }

  const deleteMsgTimer = (message) => {
    setDeleteMessage(message)
    setTimeout(() => {
      if (cleanOut !== true) {
        setDeleteMessage("")
        expenseDelete()
      }
    }, 2000)
  }

  const handleUpdate = () => {
    axios
      .post("https://car-expenses-app.herokuapp.com/update-expense", {
        carID: expense.carID,
        expenseID: expense._id,
        date,
        cost
      })
      .then(result => {
        if (result.status === 200) {
          setDateText(result.data.date)
          setCostText(result.data.cost)
          updateMsgTimer(result.data.message)
        }
      })
      .catch(error => {
        if (error.response.status === 500) {
          errorMsgTimer(error.response.data.errorMessage)
        } else {
          errorMsgTimer("No internet connection.")
        }

      })
  }

  const handleDelete = () => {
    axios
      .delete("https://car-expenses-app.herokuapp.com/delete-expense", {
        data: {
          carID: expense.carID,
          expenseID: expense._id,
        }
      })
      .then(result => {
        if (result.status === 202) {
          setDeleted(true)
          deleteMsgTimer(result.data.message)
        }
      }
      )
      .catch(error => {
        if (error.response.status === 500) {
          updateMessage(errro.response.data.errorMessage)
        }
        errorMsgTimer("No internet connection.")

      })
  }

  useEffect(() => {
    return () => {
      setCleanOut(true)
      expenseDelete()
    }
  }, [])


  return (
    <div>
      {
        deleted
          ?
          <div className={deleteMessage !== "" ? classes.DeletedContainer : classes.DeletedContainerDontShow}>
            <p>{deleteMessage}</p>
          </div>
          :
          <div className={classes.EditCard} >
            <div className={classes.AllComponents}>
              <div className={classes.DeleteButton}>
                <button onClick={() => handleDelete()}>x</button>
              </div>
              <div className={classes.DetailComponent}>
                <div className={classes.Details}>
                  <p>{expense.typeOfExpense}, {costText}€</p>
                  <p>{dateText !== "" ? dateText.slice(0, 10).replaceAll("-", "/") : null}</p>
                </div>
                <div>
                  <button className={classes.UpdateDropDownBtn}
                    onClick={() => {
                      setUpdateMode(!updateMode)
                      updateMode ? setUpdateBtnText("open editor") : setUpdateBtnText("close editor")
                    }}>{updateBtnText}</button>
                  <p className={Info.ErrorMessage}>{errorMessage !== "" ? errorMessage : null}</p>
                </div>
              </div>
              {
                updateMode
                  ?
                  <div className={classes.EditMode}>
                    <div className={classes.DottedLine}></div>
                    <p>{expense.typeOfExpense} cost:</p>
                    <input
                      type="number"
                      placeholder={expense.cost}
                      value={cost}
                      className={classes.Input}
                      onChange={event => setCost(event.target.value)}
                    />
                    <p>Date of expense:</p>
                    <DatePicker
                      onChange={date => setDate(date)}
                      selected={date} />
                    <br />
                    <button
                      className={classes.UpdateButton}
                      onClick={() => handleUpdate()}
                    >update expense</button>
                    <p className={Info.Message}>{updateMessage !== "" ? updateMessage : null}</p>
                  </div>
                  :
                  null
              }
            </div>
          </div>
      }
    </div>
  );
};

export default Edit;