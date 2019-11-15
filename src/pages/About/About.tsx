import React from "react";
import { observer } from "mobx-react-lite";
import {
  useLocation,
  useHistory,
  useParams,
  useRouteMatch
} from "react-router-dom";

const About = observer(function() {
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const match = useRouteMatch();
  console.log("history", history);
  console.log("location", location);
  console.log("params", params);
  console.log("match", match);
  return <div className="about-page">About</div>;
});

export default About;
