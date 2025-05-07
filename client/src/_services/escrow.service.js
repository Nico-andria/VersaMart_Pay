import Axios from "./caller.service";

// Get all requests for a user
let getAllEscrowsByUser = async () => {
  try {
    const { data } = await Axios.post("/api/escrow/getAllEscrowsByUser");
    return data;
  } catch (error) {
    return error.response.data;
  }
};

// Send a request to another user
let sendRequest = async (request) => {
  try {
    const { data } = await Axios.post("/api/escrow/sendRequest", request);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

// Send a request to another user
let sendRequestEscrow = async (request) => {
  try {
    const { data } = await Axios.post("/api/escrow/sendRequestEscrow", request);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

// update request status
let updateEscrowStatus = async (request) => {
  try {
    const { data } = await Axios.post(
      "/api/escrow/updateEscrowStatus",
      request
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

// update request status
let updateEscrowStatusForSeller = async (request) => {
  try {
    const { data } = await Axios.post(
      "/api/escrow/updateEscrowStatusForSeller",
      request
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};
// update request status
let acceptRequestFromBuyer = async (request) => {
  try {
    const { data } = await Axios.post(
      "/api/escrow/acceptRequestFromBuyer",
      request
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};
// update request status
let acceptTransactionByArbitrator = async (request) => {
  try {
    const { data } = await Axios.post(
      "/api/escrow/acceptTransactionByArbitrator",
      request
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};
//
export const escrowService = {
  getAllEscrowsByUser,
  sendRequest,
  updateEscrowStatus,
  sendRequestEscrow,
  updateEscrowStatusForSeller,
  acceptRequestFromBuyer,
  acceptTransactionByArbitrator,
};
