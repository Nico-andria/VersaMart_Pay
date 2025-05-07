import React, { useState } from "react";
import { Modal, Form, message } from "antd";
import StripeCheckout from "react-stripe-checkout";
import { transactionService } from "../../_services/transaction.service";

const DepositModal = ({
  showDepositModal,
  setShowDepositModal,
  reloadData,
}) => {
  const [amount, setAmount] = useState(10);
  const [form] = Form.useForm();
  const onToken = async (token) => {
    try {
      const response = await transactionService.depositFunds({
        token,
        amount: form.getFieldValue("amount"),
      });
      if (response.success) {
        reloadData();
        setShowDepositModal(false);
        message.success(response.message);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  return (
    <Modal
      title="Deposit"
      open={showDepositModal}
      onCancel={() => setShowDepositModal(false)}
      footer={null}>
      <div className="flex-col gap-1">
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                required: true,
                message: "Please input amount",
              },
            ]}>
            <input type="number" />
          </Form.Item>
          <div className="flex justify-end gap-1">
            <button className="primary-outlined-btn">Cancel</button>
            <StripeCheckout
              token={onToken}
              currency="usd"
              amount={form.getFieldValue("amount") * 100}
              shippingAddress
              stripeKey="my_PUBLISHABLE_stripekey">
              <button className="primary-contained-btn">Deposit</button>
            </StripeCheckout>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default DepositModal;
