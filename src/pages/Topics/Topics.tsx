import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { observable } from "mobx";
import { observer } from "mobx-react-lite";
import { person, array } from "../../store/index";

interface PropsType {
  person: {
    name: string;
    age: number;
  };
}

const Topics = observer(function() {
  let match = useRouteMatch();

  return (
    <div className="topics-page">
      <div className="topics-router">
        <Switch>
          <Route path={`${match!.path}/:topicId`}>
            <Topic />
          </Route>
          <Route path={match!.path}>
            <h3>Please select a topic.</h3>
          </Route>
        </Switch>
      </div>
    </div>
  );
});

const Topic = observer(function() {
  let { topicId } = useParams();
  return (
    <div className="top-page">
      <h3>Requested topic ID: {topicId}</h3>
      <div className="person-name">person name:{person.name}</div>
      <div className="array-length">array length: {array.length}</div>
    </div>
  );
});

// export { Topic, Topics };
export default Topics;
