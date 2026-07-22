import api from "../../../configs/api";

export async function loginUserApi(payload) {
  return api.post("/login", payload);
}

export async function signupUserApi(payload) {
  return api.post("/signup", payload);
}

// export async function loginAsAdminApi(payload){
//   return axios.post(`${BASE_URL}/admin`,payload);
// }