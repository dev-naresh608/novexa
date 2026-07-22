import axios from "axios";

const BASE_URL = "http://localhost:5000";

export async function loginUserApi(payload) {
  return axios.post(`${BASE_URL}/login`, payload);
}

export async function signupUserApi(payload) {
  return axios.post(`${BASE_URL}/signup`, payload);
}

// export async function loginAsAdminApi(payload){
//   return axios.post(`${BASE_URL}/admin`,payload);
// }