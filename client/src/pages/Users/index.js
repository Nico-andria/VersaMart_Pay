import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userService } from "../../_services/user.service";
import { Table, message } from "antd";
import PageTitle from "../../components/PageTitle";

const Users = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      const response = await userService.getAllUsers();
      if (response.success) {
        setUsers(response.data);
      } else {
        message.error(response.message);
      }
      if (response.message == "token expired") {
        alert("token expired, please login again");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const updateStatus = async (record, isVerified) => {
    try {
      const response = await userService.updateUserVerification({
        selectedUser: record._id,
        isVerified,
      });
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const colums = [
    {
      title: "First Name",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "email",
      dataIndex: "email",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
    },
    {
      title: "Verified",
      dataIndex: "isVerified",
      render: (text, record) => {
        return text ? "Yes" : "No";
      },
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => {
        return (
          <div className="flex gap-1">
            {record.isVerified ? (
              <button
                className="primary-outlined-btn"
                onClick={() => updateStatus(record, false)}>
                Suspend
              </button>
            ) : (
              <button
                className="primary-contained-btn"
                onClick={() => updateStatus(record, true)}>
                Activate
              </button>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <PageTitle title="Users" />
      <Table columns={colums} dataSource={users} className="mt-2" />
    </div>
  );
};

export default Users;
