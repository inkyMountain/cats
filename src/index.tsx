import React from "react";
import ReactDOM from "react-dom";
import "./reset.scss";
import App from "./App";
import config from "./config/index";

document.title = config.documentTitle;
ReactDOM.render(<App />, document.getElementById("root"));
