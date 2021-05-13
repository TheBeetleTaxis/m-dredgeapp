import React, { useEffect, useState } from "react";
import { Switch, Route} from "react-router";
//import { BrowserRouter as Router } from "react-router-dom";
import DashboardRouter from "./pages/DashboardRouter";
import LoginPage from "./pages/login-page";
import {MemoryRouter as Router } from "react-router-dom";


export default function App({ loginStatus }) {

  /** hold the current view user will see */
  const [appView, setAppView] = useState([]);

  /** this will be set to true once we are able to secure valid login status */
  const [loginStatusValid, setLoginStatusValid] = useState(false);

  /** the default login view  */
  const LoginView = () => (
    <div className="App">
      <Router forceRefresh>
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/" component={LoginPage} />
        </Switch>
      </Router>
    </div>
  );

  /**
   * create appView based on if user is logged in or not
   * the `loginStatus` is passed as property from `AppRouter` comp
   * */
  const createAppView = (loginStatus = false) => {
    if (loginStatus) {
      /**
       * set loginStatusValid. We set this state variable so that when the page refresh
       * we will still be able to track if user was login previously before we refresh
       */
      setLoginStatusValid(true);

      setAppView(
        <div className="App">
          <Router>
            <Switch>
              <DashboardRouter />
            </Switch>
          </Router>
        </div>
      );
    } else {
      /**
       * This user is not log in yet, or the user refresh and we are
       * still trying to get the login status from our async store.
       * what we will do is to wait a little while before setting `appView`
       * @todo implement this delay view feature
       */
      //setTimeout(()=>{
      setAppView(<LoginView />);
      //}, 3000);
    }
  };

  useEffect(() => {
    createAppView(loginStatus);
  }, [loginStatus]);

  return <>{appView}</>;
}
