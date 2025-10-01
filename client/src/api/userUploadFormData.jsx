import axios from "axios";

const API = "http://localhost:5002";

// Upload payment slip using FormData (NEW METHOD)
export const uploadPaymentSlipFormData = async (token, file) => {
  const formData = new FormData();
  formData.append('image', file);

  return axios.post(`${API}/api/user-payment-upload-formdata`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Upload any file using FormData
export const uploadFileFormData = async (token, file, folder = 'general') => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);

  return axios.post(`${API}/api/upload/single`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Upload multiple files
export const uploadMultipleFilesFormData = async (token, files, folder = 'general') => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file);
  });
  formData.append('folder', folder);

  return axios.post(`${API}/api/upload/multiple`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};
