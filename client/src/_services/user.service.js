import Axios from "./caller.service";

let getUser = (uid) => {
  return Axios.get("/api/users/" + uid);
};

let getMyInfo = async () => {
  try {
    const { data } = await Axios.get("/api/users/myProfile");
    return data;
  } catch (error) {
    return error.response.data;
  }
};

let getAllUsers = async () => {
  try {
    const { data } = await Axios.get("/api/users/getAllUsers");
    return data;
  } catch (error) {
    return error.response.data;
  }
};

// update user verified status
let updateUserVerification = async (payload) => {
  try {
    const { data } = await Axios.post(
      "/api/users/updateUserVerifiedStatus",
      payload
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const userService = {
  getAllUsers,
  getUser,
  getMyInfo,
  updateUserVerification,
};
