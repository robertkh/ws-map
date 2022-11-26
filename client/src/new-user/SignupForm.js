//?
import React from "react";
import { Form, Input, Button, message } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { useLngContext } from "./context/LngContext";

// todo
export default function SignupForm({ disp }) {
	//
	const strings = useLngContext();

	//
	async function onFinish(values) {
		try {
			let response = await fetch("/users/signup", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json;charset=utf-8",
				},
				body: JSON.stringify(values),
			});

			let result = await response.json();

			if (response.ok) {
				message.success(result, 5);
				disp({ type: "clearStates" });
				disp({ type: "showLogin" });
			} else {
				message.error(result);
			}
		} catch (err) {
			console.log(err.message);
		}
	}

	return (
		<div style={{ minWidth: "370px" }}>
			<Form onFinish={onFinish}>
				<h6 className="text-center mb-4" style={{ color: "#1890ff" }}>
					{strings.signup_1}
				</h6>

				<Form.Item
					name="username"
					rules={[
						{
							required: true,
							message: "Please input your Username!",
						},
					]}
				>
					<Input
						prefix={
							<UserOutlined className="site-form-item-icon" />
						}
						placeholder="Username"
					/>
				</Form.Item>
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
						prefix={
							<MailOutlined className="site-form-item-icon" />
						}
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
						prefix={
							<LockOutlined className="site-form-item-icon" />
						}
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
						{strings.signup_2}
					</Button>
				</Form.Item>
				{/*  */}
			</Form>

			<div
				className="w-100 px-2 mt-4"
				style={{ lineHeight: 2.2, marginLeft: "5px" }}
			>
				{strings.signup_3}
				<Button
					size="sm"
					type="link"
					style={{ lineHeight: 1, float: "right", color: "#1890ff" }}
					onClick={() => {
						disp({ type: "clearStates" });
						disp({ type: "showLogin" });
					}}
				>
					{strings.signup_4}
				</Button>
			</div>
		</div>
	);
}
