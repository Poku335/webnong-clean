import axios from "axios";

// http://localhost:5002/api/admin/orders

export const getOrdersAdmin = async (token) => {
  // code body
  return axios.get("http://localhost:5002/api/admin/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const changeOrderStatus = async (token, orderId, orderStatus) => {
  // code body
  return axios.put(
    "http://localhost:5002/api/admin/order-status",
    {
      orderId,
      orderStatus,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const getListAllUsers = async (token) => {
  // code body
  return axios.get("http://localhost:5002/api/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const changeUserStatus = async (token,value) => {
  // code body
  return axios.post("http://localhost:5002/api/change-status",value, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const changeUserRole = async (token,value) => {
  // code body
  return axios.post("http://localhost:5002/api/change-role",value, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Payment Check APIs
export const getPaymentOrders = async (token) => {
  return axios.get("http://localhost:5002/api/admin/payment-orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updatePaymentStatus = async (token, orderId, paymentStatus) => {
  return axios.put(
    "http://localhost:5002/api/admin/payment-status",
    {
      orderId,
      paymentStatus,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
