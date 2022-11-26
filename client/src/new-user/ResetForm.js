//?
import React from "react";
import { useLngContext } from "./context/LngContext";
import { Form, Input, Button, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

// todo
export default function ResetForm({ disp }) {
  //
  const strings = useLngContext();

  //
  const onFinish = async (values) => {
    try {
      let response = await fetch("/users/reset", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(values),
      });

      let result = await response.json();

      if (response.ok) {
        message.success(result);
        disp({ type: "clearStates" });
        disp({ type: "showLogin" });
      } else {
        message.error(result);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  //
  return (
    <div style={{ minWidth: "370px" }}>
      <Form
        name="normal_login"
        className="login-form "
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <h6 className="text-center mb-4 text-secondary">{strings.reset_1}</h6>
        <p className="text-center text-info">
          {strings.reset_2}
          <br />
          {strings.reset_3}
        </p>
        {/*  */}
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        {/*  */}
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        {/*  */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            block
          >
            {strings.reset_4}
          </Button>
        </Form.Item>
      </Form>

      <div className="w-100 my-2" style={{ marginLeft: "13px" }}>
        {strings.reset_5}

        <Button
          size="sm"
          className="text-primery float-right"
          type="link"
          style={{ lineHeight: 1 }}
          onClick={() => {
            disp({ type: "clearStates" });
            disp({ type: "showLogin" });
          }}
        >
          {strings.reset_6}
        </Button>
      </div>
    </div>
  );
}
