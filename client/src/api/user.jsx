import axios from "axios";
const API = "http://localhost:5002";

export const createUserCart = async (token, cart) => {
  // code body
  return axios.post("http://localhost:5002/api/user/cart", cart, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const listUserCart = async (token) => {
  // code body
  return axios.get("http://localhost:5002/api/user/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const saveAddress = async (token, address) => {
  // code body
  return axios.post(
    "http://localhost:5002/api/user/address",
    { address },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const saveOrder = async (token, payload) => {
  // code body
  return axios.post("http://localhost:5002/api/user/order", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const finalizeOrder = async (token) => {
  // code body
  return axios.post("http://localhost:5002/api/user/finalize-order", {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// export const finalizeOrder = async (token) => {
//   return await axios.post("http://localhost:5002/api/user/finalize-order",
//     {},
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
// };

export const payment = async (token) =>
  axios.post(`${API}/api/user/finalize-order`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

  export const getOrders = async (token) =>
  axios.get(`${API}/api/user/order`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// User Address Management
export const getUserAddresses = async (token) =>
  axios.get(`${API}/api/user/addresses`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const saveUserAddress = async (token, addressData) =>
  axios.post(`${API}/api/user/addresses`, addressData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateUserAddress = async (token, id, addressData) =>
  axios.put(`${API}/api/user/addresses/${id}`, addressData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteUserAddress = async (token, id) =>
  axios.delete(`${API}/api/user/addresses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// User Profile Management
export const updateUserProfile = async (token, profileData) =>
  axios.put(`${API}/api/user/profile`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
