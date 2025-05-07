import React, { useState } from "react";
import { Modal, Form, message } from "antd";
import { requestsService } from "../../_services/requests.service";
import { transactionService } from "../../_services/transaction.service";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../redux/loaderSlice";

function NewRequestModal({
  showNewRequestModal,
  setShowNewRequestModal,
  reloadData,
}) {
  const { user } = useSelector((state) => state.users);
  const [senderBalance, setSenderBalance] = useState(0);
  const [isVerified, setIsVerified] = useState("");
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const verifyAccount = async () => {
    try {
      dispatch(showLoader());
      const response = await transactionService.verifyAccount({
        receiver: form.getFieldValue("receiver"),
      });
      dispatch(hideLoader());
      if (response.success) {
        setIsVerified("true");
      } else {
        setIsVerified("false");
      }
    } catch (error) {
      dispatch(hideLoader());
      setIsVerified("false");
    }
  };

  const sendRequest = async (values) => {
    try {
      const res = await transactionService.verifyAccount({
        receiver: form.getFieldValue("receiver"),
      });
      setSenderBalance(res.data.balance);

      if (values.amount > senderBalance) {
        message.error("sender's funds is insufficent");
        return;
      }
      console.log(user.balance);

      dispatch(showLoader());
      const payload = {
        ...values,
        sender: user._id,
        reference: values.reference || "no reference",
        status: "success",
      };
      const response = await requestsService.sendRequest(payload);
      if (response.success) {
        reloadData();
        setShowNewRequestModal(false);
        message.success(response.message);
      } else {
        message.error(response.message);
      }
      dispatch(hideLoader());
    } catch (error) {
      message.error(error.message);
      dispatch(hideLoader());
    }
  };
  return (
    <div>
      <Modal
        title="Transfer funds"
        open={showNewRequestModal}
        onCancel={() => setShowNewRequestModal(false)}
        onClose={() => setShowNewRequestModal(false)}
        footer={null}>
        <Form layout="vertical" form={form} onFinish={sendRequest}>
          <div className="flex gap-2 items-center">
            <Form.Item label="Account Number" name="receiver" className="w-100">
              <input type="text" />
            </Form.Item>
            <button
              className="primary-contained-btn mt-1"
              type="button"
              onClick={verifyAccount}>
              VERIFY
            </button>
          </div>

          {isVerified === "true" && (
            <div className="success-bg">
              <h1 className="text-sm">Account Verified</h1>
            </div>
          )}
          {isVerified === "false" && (
            <div className="error-bg">
              <h1 className="text-sm">Account Not found</h1>
            </div>
          )}

          <Form.Item
            label="Amount"
            name="amount"
            className="w-100"
            /* rules={[
              {
                required: true,
                message: "Please input your amount",
              },
              {
                max: user.balance,
                message: "Insufficient balance",
              },
            ]} */
          >
            <input type="text" />
          </Form.Item>

          <Form.Item label="Description" name="description" className="w-100">
            <textarea name="" id="" cols="30" rows="10"></textarea>
          </Form.Item>

          <div className="flex justify-end gap-1">
            <button className="primary-outlined-btn">Cancel</button>
            <button className="primary-contained-btn">Request</button>
            {/* {Number(form.getFieldValue("amount")) < user.balance &&
              isVerified === "true" && (
                <button className="primary-contained-btn">Transfer</button>
              )} */}
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default NewRequestModal;
