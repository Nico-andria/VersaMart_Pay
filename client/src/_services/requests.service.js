import Axios from "./caller.service";

// Get all requests for a user
let getAllRequestsByUser = async () => {
  try {
    const { data } = await Axios.post("/api/requests/getAllRequestsByUser");
    return data;
  } catch (error) {
    return error.response.data;
  }
};

// Send a request to another user
let sendRequest = async (request) => {
  try {
    const { data } = await Axios.post("/api/requests/sendRequest", request);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

// update request status
let updateRequestStatus = async (request) => {
  try {
    const { data } = await Axios.post(
      "/api/requests/updateRequestStatus",
      request
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};
//
export const requestsService = {
  getAllRequestsByUser,
  sendRequest,
  updateRequestStatus,
};
