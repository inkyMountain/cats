import React from "react";
import * as loadableComponents from "./pages/index";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

const App = () => {
  const routes = (
    <Switch>
      <Route exact path="/" component={loadableComponents.Home} />
      <Route path="/home" component={loadableComponents.Home} />
      <Route path="/about" component={loadableComponents.About} />
      <Route path="/topics" component={loadableComponents.Topics} />
    </Switch>
  );

  const navigation = (
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/topics">Topics</Link>
        </li>
      </ul>
    </div>
  );

  return (
    <BrowserRouter>
      {routes}
    </BrowserRouter>
  );
};

export default App;
