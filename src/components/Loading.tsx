import React from "react";
import Loadable, { LoadingComponentProps } from "react-loadable";

const Loading = ({ pastDelay }: LoadingComponentProps) => {
  const loading = <div className="loading">Loading...</div>;
  const empty = <div></div>;
  return pastDelay ? loading : empty;
};

export { Loading };
