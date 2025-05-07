import Axios from "./caller.service";

/* let getAllProperties = () => {
    return Axios.get('/api/properties')
} */

// verify receiver
let verifyAccount = async (payload) => {
  try {
    const { data } = await Axios.post(
      "/api/transactions/verifyAccount",
      payload
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

let transferFunds = async (payload) => {
  try {
    const { data } = await Axios.post("/api/transactions/transfer", payload);
    return data;
  } catch (error) {
    return error.response.data;
  }
};

let getAllTransactions = async () => {
  try {
    const { data } = await Axios.get("/api/transactions/getAllTransactions");
    return data;
  } catch (error) {
    return error.response.data;
  }
};

// deposit funds using stripe

let depositFunds = async (payload) => {
  try {
    const { data } = await Axios.post(
      "/api/transactions/depositFunds",
      payload
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

export const transactionService = {
  verifyAccount,
  transferFunds,
  getAllTransactions,
  depositFunds,
};
