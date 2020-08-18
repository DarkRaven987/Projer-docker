import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "../pages/home";
import LoginPage from '../pages/login';
import ForgotPasswordForm from "../pages/forgot-password";

function AppRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={ LoginPage } />
        <Route path="/forgot" component={ ForgotPasswordForm } />
        <Route path="/" component={ HomePage } exact/>
      </Switch>
    </Router>
  );
}

export default AppRouter;
