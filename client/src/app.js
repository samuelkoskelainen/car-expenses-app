import React from 'react';
import { Switch, Route, HashRouter as Router } from 'react-router-dom'
import Main from './components/Main/Main'
import Navigation from './components/Navigation/Navigation'
import Car from './components/Car/Car'
import Signup from './components/Signup/Signup'
import Login from './components/Login/Login'
import Expenses from './components/Expenses/Expenses'
import Report from './components/Report/Report'
import './app.css'
import EditExpenses from './components/Expenses/EditExpenses';

const App = () => {
  return (
    <Router>
      <Navigation />
      <Switch>
        <Route path="/" exact={true} component={Main} />
        <Route path="/car-setup" exact={true} component={Car} />
        <Route path="/signup" exact={true} component={Signup} />
        <Route path="/login" exact={true} component={Login} />
        <Route path="/set-expenses/:carID" component={Expenses} />
        <Route path="/edit-expenses/:carID" component={EditExpenses} />
        <Route path="/report/:carID" component={Report} />
      </Switch>
    </Router>
  );
};

export default App;