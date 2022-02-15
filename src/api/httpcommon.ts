import axios from "axios";
import config from "../util/config";
export default axios.create({
  baseURL: config.apiURL,
  headers: {
    "Content-type": "application/json"
  }
})
