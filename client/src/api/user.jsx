import axios from "axios";
const API = "http://localhost:5001";

export const createUserCart = async (token, cart) => {
  // code body
  return axios.post("http://localhost:5001/api/user/cart", cart, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const listUserCart = async (token) => {
  // code body
  return axios.get("http://localhost:5001/api/user/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const saveAddress = async (token, address) => {
  // code body
  return axios.post(
    "http://localhost:5001/api/user/address",
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
  return axios.post("http://localhost:5001/api/user/order", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// export const finalizeOrder = async (token) => {
//   return await axios.post("http://localhost:5001/api/user/finalize-order",
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
