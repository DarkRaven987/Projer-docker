/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Form, Input, Button } from "antd";

const { Item } = Form;

interface IDefaultProps {
  username: string;
  password: string;
  handleSignInProcess: Function;
  handleSignInState: Function;
  handleLoginMode: Function;
}

function LoginForm(props: IDefaultProps) {
  const {
    username,
    password,
    handleSignInProcess,
    handleSignInState,
    handleLoginMode,
  } = props;
  return (
    <div className="login-form-container">
      <div className="login-form">
        <h1>Sign In</h1>
        <Form onFinish={() => handleSignInProcess()}>
          <Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please input your username!" },
              { min: 4, message: "Minimal length of username: 4." },
              { max: 16, message: "Maximum lengt of username: 16." },
            ]}
          >
            <Input
              value={username}
              onChange={(e) => handleSignInState('username', e.target.value)}
            />
          </Item>
          <Item
            className="last-row"
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 8, message: "Minimal length of password: 8." },
              { max: 14, message: "Maximum length of password: 14." },
              {
                pattern: /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
                message:
                  "Password must container at least one uppercase letter and number!",
              },
            ]}
          >
            <Input.Password
              value={password}
              onChange={(e) => handleSignInState('password', e.target.value)}
            />
          </Item>

          <div className="forgot-password-container">
            <a
              className="forgot-password"
              onClick={(e) => {
                e.preventDefault();
                handleLoginMode("ForgotPassword");
              }}
            >
              Forgot password?
            </a>
          </div>

          <div className="login-buttons">
            <Button size="large" onClick={() => handleLoginMode("SignUp")}>
              Sign Up
            </Button>
            <Button size="large" type="primary" htmlType="submit">
              Log In
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default LoginForm;
