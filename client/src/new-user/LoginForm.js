//?
import { Form, Input, Button, Checkbox, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNameContext } from "./context/NameContext";
import { useLngContext } from "./context/LngContext";
import { useState } from "react";
import { css } from "@emotion/react";
import PuffLoader from "react-spinners/PuffLoader";

// todo
export default function LoginForm({ disp }) {
  //
  const strings = useLngContext();
  const [, /* name */ setName] = useNameContext();
  let [loading, setLoading] = useState(false);

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  const onFinish = async (values) => {
    setLoading(true);
    try {
      let response = await fetch("/users/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      setLoading(false);

      let result = await response.json();

      if (response.ok) {
        setName(result);
        message.success(strings.login_7);

        disp({ type: "clearStates" });
        disp({ type: "showLogout" });
      } else {
        message.error(result);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  //
  return (
    <div style={{ minWidth: "370px" }} className="py-3 text-success">
      <h6
        style={{
          marginTop: "-20px",
          marginBottom: "30px",
          textAlign: "center",
          color: "#237804",
        }}
      >
        {strings.login_1}
      </h6>

      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
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
        <Form.Item style={{ lineHeight: 2.2, paddingLeft: "10px" }}>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>{strings.login_2}</Checkbox>
          </Form.Item>

          <Button
            type="link"
            onClick={() => {
              disp({ type: "clearStates" });
              disp({ type: "showReset" });
            }}
            style={{ float: "right", color: "#237804" }}
          >
            {strings.login_3}
          </Button>
        </Form.Item>
        {/*  */}
        <Form.Item>
          <Button
            htmlType="submit"
            className="login-form-button"
            block
            style={{ background: "#52c41a", color: "#fff" }}
          >
            <PuffLoader
              color="#fff"
              loading={loading}
              css={override}
              size={22}
            />
            <span className="px-3" style={{ verticalAlign: 6 }}>
              {strings.login_4}
            </span>
          </Button>
        </Form.Item>
        {/*  */}
        <div style={{ lineHeight: 2.2, paddingLeft: "10px" }}>
          {strings.login_5}
          <Button
            type="link"
            onClick={() => {
              disp({ type: "clearStates" });
              disp({ type: "showSignup" });
            }}
            style={{ float: "right", color: "#237804" }}
          >
            {strings.login_6}
          </Button>
        </div>
      </Form>
    </div>
  );
}
