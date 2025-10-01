import axios from "axios";

export const createProduct = async (token, form) => {
  // code body
  return axios.post("http://localhost:5002/api/product", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const listProduct = async (count = 20) => {
  // code body
  return axios.get("http://localhost:5002/api/products/" + count);
};

export const readProduct = async (token, id) => {
  // code body
  return axios.get("http://localhost:5002/api/product/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const deleteProduct = async (token, id) => {
  // code body
  return axios.delete("http://localhost:5002/api/product/" + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const updateProduct = async (token, id, form) => {
  // code body
  return axios.put("http://localhost:5002/api/product/" + id, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const uploadFiles = async (token, form, folder = "products") => {
  // code
  // console.log('form api frontent', form)
  return axios.post(
    "http://localhost:5002/api/images",
    {
      image: form,
      folder: folder,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const removeFiles = async (token, public_id) => {
  // code
  // console.log('form api frontent', form)
  return axios.post(
    "http://localhost:5002/api/removeimages",
    {
      public_id,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const searchFilters = async (arg) => {
  // code body
  return axios.post("http://localhost:5002/api/search/filters", arg);
};

export const listProductBy = async (sort, order, limit) => {
  // code body
  return axios.post("http://localhost:5002/api/productby", {
    sort,
    order,
    limit,
  });
};
