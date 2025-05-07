import React from "react";
import { Col, Form, Row, message } from "antd";
import { useNavigate } from "react-router-dom";
import { accountService } from "../../_services/account.service";

function Register() {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      const response = await accountService.register(values);
      if (response.success) {
        message.success(response.message);
        navigate("/login");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  return (
    <div className="m-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">VERSAMART - REGISTER</h1>

        <h1
          className="text-sm underline"
          onClick={() => {
            navigate("/login");
          }}>
          Already a member, Log in
        </h1>
      </div>
      <hr />
      <Form layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="First name" name="firstName">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Last name" name="lastName">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Email" name="email">
              <input type="email" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Phone Number" name="phoneNumber">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Identification Type" name="identificationType">
              <select>
                <option value="driverLicence">Driver Licence</option>
                <option value="IDCard">ID Card</option>
                <option value="passport">Passport</option>
              </select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Identification Number" name="identificationNumber">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Address" name="address">
              <textarea name="address" id="" cols="30" rows="10"></textarea>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="password" name="password">
              <input type="password" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Confirm password" name="ConfirmPassword">
              <input type="password" />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end">
          <button className="primary-contained-btn" type="submit">
            Register
          </button>
        </div>
      </Form>
    </div>
  );
}

export default Register;
