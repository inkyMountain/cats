import Loadable from "react-loadable";
import { Loading } from "../components/Loading";

const LOADING_DELAY = 1000;

const About = Loadable({
  loader: () => import("./About/About"),
  loading: Loading,
  delay: LOADING_DELAY
});

const Topics = Loadable({
  loader: () => import("./Topics/Topics"),
  loading: Loading,
  delay: LOADING_DELAY
});

const Home = Loadable({
  loader: () => import("./Home/Home"),
  loading: Loading,
  delay: LOADING_DELAY
});

export { About, Topics, Home };
