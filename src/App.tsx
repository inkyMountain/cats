import React from "react";
import { Home, About, Topics } from "./pages/index";
import { BrowserRouter, Switch, Route } from "react-router-dom";

const App = () => {
  const routes = (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/home" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/topics" component={Topics} />
    </Switch>
  );

  return <BrowserRouter>{routes}</BrowserRouter>;
};

export default App;
