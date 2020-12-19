const express = require("express")
const app = express()
const path = require("path")
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3001
const bcrypt = require("bcryptjs")
const { ObjectId } = require("mongodb")

const config = require('./config')
const mongoose = require('mongoose')
mongoose.connect(config, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

const Car = require('./models/Car')
const User = require("./models/User")
const Expense = require("./models/Expense")

db.on('error', console.error.bind(console, 'Mongodb connection error:'))
db.once('open', () => console.log('Mongodb connected'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "..", "client", "build")))
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://car-expenses-app.herokuapp.com')
  res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
});

app.get("/get-all-cars/:name", (req, res, next) => {
  const username = req.params.name

  Car
    .find({ user: username })
    .then(cars => {
      if (cars) {
        if (cars.length === 0) {
          console.log("DID NOT FIND CARS")
          res.status(404).send({ errorMessage: "Looking empty in here..." })
        } else {
          console.log("FOUND CARS:")
          console.log(cars)
          res.status(200).send({ cars })
        }
      }
    })
})

app.get("/get-one-car/:carID", (req, res, next) => {
  const carID = req.params.carID

  Car
    .findOne({ _id: carID })
    .then(car => {
      if (car) {
        res.status(200).send({ car })
      } else {
        res.status(404).send({ errorMessage: "Could not find the car" })
      }
    })
    .catch((error) => {
      res.status(500).send({ errorMessage: "We failed getting your car. please try again." })
    })
})

app.get("/get-expenses/:carID/:user", (req, res, next) => {
  const carID = req.params.carID
  const username = req.params.user

  Expense
    .find({
      carID: ObjectId(carID),
      user: username
    })
    .then(expenses => {
      if (expenses) {
        const sortedCostByType = [{}, {}, {}, {}]

        const allCostsCombined = [
          { cost: 0 }
        ]

        for (let i = 0; i < expenses.length; i++) {
          if (expenses[i].typeOfExpense === "Repair") {
            sortedCostByType[0].typeOfExpense = "Repairs"
            sortedCostByType[0].cost = 0
          } else if (expenses[i].typeOfExpense === "Insurance") {
            sortedCostByType[1].typeOfExpense = "Insurances"
            sortedCostByType[1].cost = 0
          } else if (expenses[i].typeOfExpense === "Ticket") {
            sortedCostByType[2].typeOfExpense = "Tickets"
            sortedCostByType[2].cost = 0
          } else if (expenses[i].typeOfExpense === "Other") {
            sortedCostByType[3].typeOfExpense = "Others"
            sortedCostByType[3].cost = 0
          }
        }

        for (let i = 0; i < expenses.length; i++) {
          if (expenses[i].typeOfExpense === "Repair") {
            sortedCostByType[0].cost += expenses[i].cost
            allCostsCombined[0].cost += expenses[i].cost
          } else if (expenses[i].typeOfExpense === "Insurance") {
            sortedCostByType[1].cost += expenses[i].cost
            allCostsCombined[0].cost += expenses[i].cost
          } else if (expenses[i].typeOfExpense === "Ticket") {
            sortedCostByType[2].cost += expenses[i].cost
            allCostsCombined[0].cost += expenses[i].cost
          } else if (expenses[i].typeOfExpense === "Other") {
            sortedCostByType[3].cost += expenses[i].cost
            allCostsCombined[0].cost += expenses[i].cost
          }
        }
        res.status(200).send({ expenses: expenses, sortedCostByType, allCostsCombined })
      } else {
        res.status(404).send({ errorMessage: "No expenses set to this car." })
      }
    })
})

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"))
})

app.post("/user-signup", (req, res, next) => {
  const username = req.body.name
  const password = req.body.password
  bcrypt.hash(password, 12, function (err, hash) {
    if (err) {
      res.status(500).send({ errorMessage: "encrypting failed" })
    }

    if (hash) {
      User
        .findOne({ name: username })
        .then(user => {
          if (user) {
            res.status(409).send({ errorMessage: "Username already exists! Please try another one." })
          } else {
            const newUser = new User({
              name: username,
              password: hash
            })
            newUser
              .save()

            res.status(200).send({ username: newUser.name })
          }
        })
    }
  })
})

app.post("/user-login", (req, res, next) => {
  const username = req.body.name
  const password = req.body.password
  User
    .findOne({ name: username })
    .then(user => {
      if (user) {
        bcrypt.compare(password, user.password, function (err, result) {
          if (result === true) {
            res.status(200).send({ username: user.name })
          } else {
            res.status(409).send({ errorMessage: "Username or password is wrong." })
          }
        })
      } else {
        res.status(409).send({ errorMessage: "Username or password is wrong." })
      }
    })
})

app.post("/update-expense", (req, res, next) => {
  Expense
    .updateOne(
      { _id: req.body.expenseID, carID: req.body.carID },
      {
        $set: { cost: req.body.cost, dateOfExpense: req.body.date }
      }, function (err, result) {
        if (result) {
          res.status(200).send({
            date: req.body.date,
            cost: req.body.cost,
            message: "Expense updated!"
          })
        } else {
          res.status(500).send({
            errorMessage: "We failed trying to update, please try again."
          })
        }
      })
})

app.post("/car-submit", (req, res, next) => {
  const newCar = new Car({
    brand: req.body.brand,
    model: req.body.model,
    name: req.body.name,
    user: req.body.user
  })
  newCar
    .save()
    .then(saveOK => {
      if (saveOK) {
        res.status(201).send({ message: "Car created!" })
      } else {
        res.status(500).send({ errorMessage: "Could not setup car. Please try again." })
      }
    })
})

app.post("/set-expense", (req, res, next) => {
  const carID = req.body.carID
  const user = req.body.user
  const dateOfExpense = req.body.dateOfExpense
  const typeOfExpense = req.body.typeOfExpense
  const cost = req.body.cost
  const carName = req.body.carName
  const carBrand = req.body.carBrand
  const carModel = req.body.carModel

  const newExpense = new Expense({
    typeOfExpense,
    dateOfExpense,
    cost,
    carID,
    carName,
    carBrand,
    carModel,
    user
  })

  newExpense
    .save()
    .then(saveOK => {
      if (saveOK) {
        res.status(201).send({ message: "Expense added!", expenseType: req.body.typeOfExpense })
      } else {
        res.status(500).send({ errorMessage: "Error, please try adding again.", expenseType: req.body.typeOfExpense })
      }
    })
})

app.delete("/delete-expense", (req, res, next) => {
  Expense
    .deleteOne(
      { _id: req.body.expenseID, carID: req.body.carID }
    )
    .then(result => {
      if (result && result.deletedCount === 1) {
        res.status(202).send({ message: "expense deleted succesfully" })
      } else {
        res.status(500).send({ errorMessage: "We failed trying to delete, please try again." })
      }
    })
    .catch(error => {
      if (error) {
        res.status(500).send({ errorMessage: "We failed trying to delete, please try again." })
      }
    })
})

app.listen(PORT, () => console.log(`server listening on port: ${PORT}`))