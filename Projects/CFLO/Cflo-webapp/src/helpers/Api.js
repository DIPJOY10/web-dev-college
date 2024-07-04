import axios from "axios";
import firebase from "firebase";
import config from "../config/index";
let Api = null;

Api = axios.create({ baseURL: config.apiUrl });

// todo: setup interceptors

Api.interceptors.request.use(
  async function (config) {
    // console.log(process.env,' is process env')
    const token = localStorage.getItem("token");
    const loggedInFirebaseUId = localStorage.getItem("loggedInFirebaseUId");
    // const token = await  Auth.currentUser.getIdToken(true)
    config.data = {
      ...(config.data || {}),
      ...(token ? { token } : {}),
      loggedInFirebaseUId,
    };

    return config;
  },
  (error) => Promise.reject(error)
);

Api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // console.log({ error });
    return false;
  }
);

export default Api;
