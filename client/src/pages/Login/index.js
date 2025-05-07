import React from "react";
import { Col, Form, Row, message } from "antd";
import { useNavigate } from "react-router-dom";

import { accountService } from "../../_services/account.service";

function Login() {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      const response = await accountService.login(values);
      if (response.success) {
        message.success(response.message);
        accountService.saveToken(response.data);
        //navigate("/login");
        window.location.href = "/";
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  return (
    <div className="bg-primary flex items-center justify-center h-screen">
      <div className="card w-400 p-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">VERSAMART - Login</h1>
        </div>
        <hr />
        <Form layout="vertical" onFinish={onFinish} className="w-400">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Email" name="email">
                <input type="email" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="password" name="password">
                <input type="password" />
              </Form.Item>
            </Col>
          </Row>

          <button className="primary-contained-btn" type="submit">
            Login
          </button>
          <h1
            className="text-sm underline mt-2"
            onClick={() => {
              navigate("/register");
            }}>
            Not a member, Register
          </h1>
        </Form>
      </div>
    </div>
  );
}

export default Login;
