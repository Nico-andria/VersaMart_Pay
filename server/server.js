const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const userRoute = require("./routes/userRoute");
const transactionRoute = require("./routes/transactionRoute");
const requestRoute = require("./routes/requestRoute");
const escrowRoute = require("./routes/escrowRoute");

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/transactions", transactionRoute);
app.use("/api/requests", requestRoute);
app.use("/api/escrow", escrowRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
