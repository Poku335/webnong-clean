import axios from "axios";

// ใช้ API เดียวกันกับ product upload แต่สำหรับ user payment slip
export const uploadUserPaymentSlip = async (token, form, folder = "payment-slips") => {
  return axios.post(
    "http://localhost:5002/api/user-payment-upload",
    {
      image: form, // Base64 image data
      folder: folder,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};