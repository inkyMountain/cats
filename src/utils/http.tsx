import axios from "axios";
import config from "../config/index";

axios.defaults.headers["x-api-key"] = config.apiKeys.cats;

export default axios;
