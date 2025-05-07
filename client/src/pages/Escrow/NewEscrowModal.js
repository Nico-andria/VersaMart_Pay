import React, { useState } from "react";
import { Modal, Form, message } from "antd";
import { escrowService } from "../../_services/escrow.service";
import { transactionService } from "../../_services/transaction.service";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../redux/loaderSlice";

function NewEscrowModal({
  showNewEscrowModal,
  setShowNewEscrowModal,
  reloadData,
}) {
  const { user } = useSelector((state) => state.users);
  const [isVerified, setIsVerified] = useState("");
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [senderUnits, setSenderUnits] = useState(0);

  const verifyAccount = async () => {
    try {
      dispatch(showLoader());
      const response = await transactionService.verifyAccount({
        receiver: form.getFieldValue("seller"),
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

  const sendRequestEscrow = async (values) => {
    try {
      const res = await transactionService.verifyAccount({
        receiver: form.getFieldValue("seller"),
      });
      setSenderUnits(res.data.units);

      if (values.units > senderUnits) {
        message.error("Insufficent funds");
        return;
      }

      dispatch(showLoader());
      const payload = {
        ...values,
        buyer: user._id,
        arbitrator: "65709796fdde5b54b52ba007",
        reference: values.description || "no reference",
        status: "success",
      };
      console.log(payload);
      const response = await escrowService.sendRequestEscrow(payload);
      if (response.success) {
        reloadData();
        setShowNewEscrowModal(false);
        message.success(response.message);
      } else {
        message.error(response.message);
        console.log(response.message);
      }
      dispatch(hideLoader());
    } catch (error) {
      message.error(error.message);
      console.log(error.message);
      dispatch(hideLoader());
    }
  };
  /* const sendRequest = async (values) => {
    try {
      const res = await transactionService.verifyAccount({
        receiver: form.getFieldValue("buyer"),
      });
      setSenderBalance(res.data.balance);

      if (values.amount > senderBalance) {
        message.error("Insufficent funds");
        return;
      }

      dispatch(showLoader());
      const payload = {
        ...values,
        seller: user._id,
        reference: values.reference || "no reference",
        status: "success",
      };
      const response = await escrowService.sendRequest(payload);
      if (response.success) {
        reloadData();
        setShowNewEscrowModal(false);
        message.success(response.message);
      } else {
        message.error(response.message);
      }
      dispatch(hideLoader());
    } catch (error) {
      message.error(error.message);
      dispatch(hideLoader());
    }
  }; */
  return (
    <div>
      <Modal
        title="Transfer funds"
        open={showNewEscrowModal}
        onCancel={() => setShowNewEscrowModal(false)}
        onClose={() => setShowNewEscrowModal(false)}
        footer={null}>
        <Form layout="vertical" form={form} onFinish={sendRequestEscrow}>
          <div className="flex gap-2 items-center">
            <Form.Item label="Account Number" name="seller" className="w-100">
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
            label="Units"
            name="units"
            className="w-100"
            /*  rules={[
              {
                required: true,
                message: "Please input your amount",
              },
              {
                max: senderBalance,
                message: "Sender's balance is insufficent",
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

export default NewEscrowModal;
