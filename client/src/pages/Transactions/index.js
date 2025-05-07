import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import { Table, message } from "antd";
import TransactionModal from "./TransactionModal";
import { transactionService } from "../../_services/transaction.service";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../redux/loaderSlice";
import moment from "moment";
import DepositModal from "./DepositModal";

function Transactions() {
  const [showTransferFundsModal, setShowTransferFundsModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => {
        return moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss A");
      },
    },
    {
      title: "Transaction ID",
      dataIndex: "_id",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (text, record) => {
        if (record.sender._id === record.receiver._id) {
          return "Deposit";
        } else if (record.sender._id === user._id) {
          return "Debit";
        } else {
          return "Credit";
        }
      },
    },
    {
      title: "reference account",
      dataIndex: "",
      render: (text, record) => {
        return record.sender._id === user._id ? (
          <div>
            <h1 className="text-sm">
              {record.receiver.firstName} {record.sender.lastName}
            </h1>
          </div>
        ) : (
          <div>
            <h1 className="text-sm">
              {record.sender.firstName} {record.sender.lastName}
            </h1>
          </div>
        );
      },
    },
    {
      title: "reference",
      dataIndex: "reference",
    },
    {
      title: "status",
      dataIndex: "status",
    },
  ];
  const getData = async () => {
    try {
      dispatch(showLoader());
      const response = await transactionService.getAllTransactions();
      if (response.success) {
        setData(response.data);
      }
      if (response.message === "token expired") {
        alert("token expired, please login again");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      dispatch(hideLoader());
    } catch (error) {
      dispatch(hideLoader());
      message.error(error.message);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className="flex justify-between items-center">
        <PageTitle title={"Transactions"} />

        <div className="flex gap-1">
          <button
            className="primary-outlined-btn"
            onClick={() => setShowDepositModal(true)}>
            Deposit
          </button>
          <button
            className="primary-contained-btn"
            type="button"
            onClick={() => setShowTransferFundsModal(true)}>
            Transfer
          </button>
        </div>
      </div>
      <Table columns={columns} dataSource={data} />

      {showTransferFundsModal && (
        <TransactionModal
          showTransferFundsModal={showTransferFundsModal}
          setShowTransferFundsModal={setShowTransferFundsModal}
          reloadData={getData}
        />
      )}

      {showDepositModal && (
        <DepositModal
          showDepositModal={showDepositModal}
          setShowDepositModal={setShowDepositModal}
          reloadData={getData}
        />
      )}
    </div>
  );
}

export default Transactions;
