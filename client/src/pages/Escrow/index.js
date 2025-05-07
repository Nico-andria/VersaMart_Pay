import React, { useEffect, useState } from "react";
import { Table, Tabs, message } from "antd";
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { ReloadUser } from "../../redux/usersSlice";
import NewEscrowModal from "./NewEscrowModal";
import { escrowService } from "../../_services/escrow.service";
const { TabPane } = Tabs;

const Escrow = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [showNewEscrowModal, setShowNewEscrowModal] = useState(false);

  const { user } = useSelector((state) => state.users);

  const getData = async () => {
    try {
      const response = await escrowService.getAllEscrowsByUser();
      if (response.success) {
        const sendData = response.data.filter(
          (item) => item.buyer._id === user._id
        );
        const receivedData = response.data.filter(
          (item) => item.seller._id === user._id
        );
        const arbitratorData = response.data.filter(
          (item) => item.arbitrator._id === user._id
        );

        setData({
          sent: sendData,
          received: receivedData,
          arbitrator: arbitratorData,
        });
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const sendSellerFunds = async (record, status) => {
    try {
      if (status === "accepted" && record.amountFromSeller > user.balance) {
        message.error("insufficent funds");
        console.log(error);
        return;
      } else {
        const response = await escrowService.acceptRequestFromBuyer({
          ...record,
          status,
        });
        if (response.success) {
          message.success(response.message);
          getData();
          dispatch(ReloadUser(true));
        } else {
          message.error(response.message);
        }
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const updateStatus = async (record, status) => {
    try {
      if (status === "accepted" && record.amountFromSeller > user.balance) {
        message.error("insufficent funds");
        console.log(error);
        return;
      } else {
        const response = await escrowService.updateEscrowStatus({
          ...record,
          status,
        });
        if (response.success) {
          message.success(response.message);
          getData();
          dispatch(ReloadUser(true));
        } else {
          message.error(response.message);
        }
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const acceptTransactionByArbitrator = async (record, status) => {
    try {
      console.log(typeof record.units);
      const response = await escrowService.acceptTransactionByArbitrator({
        ...record,
        status,
      });
      if (response.success) {
        message.success(response.message);
        getData();
        dispatch(ReloadUser(true));
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Request ID",
      dataIndex: "_id",
    },
    {
      title: "Seller",
      dataIndex: "seller",
      render(seller) {
        return seller.firstName + " " + seller.lastName;
      },
    },
    {
      title: "Buyer",
      dataIndex: "buyer",
      render(buyer) {
        return buyer.firstName + " " + buyer.lastName;
      },
    },
    {
      title: "Units",
      dataIndex: "units",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Date",
      dataIndex: "date",
      render(text, record) {
        return moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss A");
      },
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Arbitrator",
      dataIndex: "arbitrator",
      render(arbitrator) {
        return arbitrator.firstName + " " + arbitrator.lastName;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        if (record.status === "pending" && record.seller._id === user._id) {
          return (
            <div className="flex gap-1">
              <h1
                className="text-sm underline"
                onClick={() => updateStatus(record, "rejected")}>
                Reject
              </h1>
              <h1
                className="text-sm underline"
                onClick={() => {
                  sendSellerFunds(record, "acceptedBySeller");
                }}>
                Accept
              </h1>
            </div>
          );
        } else if (
          (record.status === "pending" ||
            record.status === "acceptedBySeller") &&
          record.arbitrator._id === user._id
        ) {
          return (
            <div className="flex gap-1">
              <h1
                className="text-sm underline"
                onClick={() => updateStatus(record, "rejected")}>
                Reject
              </h1>
              <h1
                className="text-sm underline"
                onClick={() => {
                  acceptTransactionByArbitrator(record, "accepted");
                }}>
                Accept
              </h1>
            </div>
          );
        }
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className="flex justify-between">
        <PageTitle title="Requests" />
        <button
          className="primary-outlined-btn"
          onClick={() => {
            setShowNewEscrowModal(true);
          }}>
          Request Funds From Sellers
        </button>
      </div>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Sent" key="1">
          <Table columns={columns} dataSource={data.sent} />
        </TabPane>
        <TabPane tab="Received" key="2">
          <Table columns={columns} dataSource={data.received} />
        </TabPane>
        <TabPane tab="Arbitrator" key="3">
          <Table columns={columns} dataSource={data.arbitrator} />
        </TabPane>
      </Tabs>

      {showNewEscrowModal && (
        <NewEscrowModal
          showNewEscrowModal={showNewEscrowModal}
          setShowNewEscrowModal={setShowNewEscrowModal}
          reloadData={getData}
        />
      )}
    </div>
  );
};

export default Escrow;
