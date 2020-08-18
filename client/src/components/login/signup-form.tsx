/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Form, Input, Button } from "antd";

const { Item } = Form;

interface IDefaultProps {
  email: string;
  username: string;
  firstName: string;
  secondName: string;
  password_first: string;
  password_second: string;
  handleSignUpState: Function;
  handleLoginMode: Function;
  handleSignUpProcess: Function;
}

function SignUpForm(props: IDefaultProps) {
    const {
      email,
      username,
      firstName,
      secondName,
      password_first,
      password_second,
      handleLoginMode,
      handleSignUpProcess,
      handleSignUpState
    } = props;
    
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    return (
      <div className="login-form-container">
        <div className="login-form">
          <h1>Sign Up</h1>
          <Form 
            {...layout}
            onFinish={() => handleSignUpProcess()}
          >
            <Item
              label="First name"
              name="first_name"
              rules={[
                { required: true, message: "Please input your first name!" },
                { min: 2, message: "Minimal length of first name: 2." },
              ]}
            >
              <Input
                value={firstName}
                onChange={(e) => handleSignUpState('firstName', e.target.value)}
              />
            </Item>
            <Item
              label="Second name"
              name="second_name"
              rules={[
                { required: true, message: "Please input second name!" },
                { min: 2, message: "Minimal length of second name: 2." },
              ]}
            >
              <Input
                value={secondName}
                onChange={(e) => handleSignUpState('secondName', e.target.value)}
              />
            </Item>
            <Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
                { min: 4, message: "Minimal length of username: 4." },
                { max: 16, message: "Maximum length of username: 16." },
              ]}
            >
              <Input
                value={username}
                onChange={(e) => handleSignUpState('username', e.target.value)}
              />
            </Item>
            <Item
              label="E-mail"
              name="email"
              rules={[
                { required: true, message: "Please input your e-mail!" },
                { type: 'email'}
              ]}
            >
              <Input
                value={email}
                onChange={(e) => handleSignUpState('email', e.target.value)}
              />
            </Item>
            <Item
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
                value={password_first}
                onChange={(e) => handleSignUpState('password_first', e.target.value)}
              />
            </Item>
            <Item
              label="Confirm password"
              name="confirm_password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 8, message: "Minimal length of password: 8." },
                { max: 14, message: "Maximum length of password: 14." },
                {
                  pattern: new RegExp(`${password_first}`, "g"),
                  message:
                    "Passwords should be equal!",
                },
              ]}
            >
              <Input.Password
                value={password_second}
                onChange={(e) => handleSignUpState('password_second', e.target.value)}
              />
            </Item>

            <div className="login-buttons">
              <Button size="large" onClick={() => handleLoginMode('SignIn')}>
                Sign In
              </Button>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
              >
                Register
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
}

export default SignUpForm;