import axios from "axios";

export const uploadUserFiles = async (token, form, folder = "user-uploads") => {
  return axios.post(
    "http://localhost:5002/api/user-images",
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
