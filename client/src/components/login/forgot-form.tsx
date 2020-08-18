/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Form, Input, Button } from "antd";

const { Item } = Form;

interface IDefaultProps {
  forgotPassword: any;
  handleForgotState: Function;
  handleLoginMode: Function;
  handlePasswordReset: Function;
}

const layout = {
labelCol: { span: 8 },
wrapperCol: { span: 16 },
};

function ForgotForm(props: IDefaultProps) {
  const {
    forgotPassword,
    handleForgotState,
    handleLoginMode,
    handlePasswordReset
  } = props;

  return (
    <div className="login-form-container">
      {
        !forgotPassword.showMessage ? (
          <div className="login-form">
            <h1>Forgot password</h1>
            <Form {...layout} onFinish={() => handlePasswordReset()}>
              <Item
                label="E-mail"
                name="email"
                rules={[
                  { required: true, message: "Please input your e-mail!" },
                  { type: 'email'}
                ]}
              >
                <Input
                  value={forgotPassword.email}
                  onChange={(e) => handleForgotState('email', e.target.value)}
                />
              </Item>

              <div className="login-buttons">
                <Button size="large" onClick={() => handleLoginMode("SignIn")}>
                  Sign In
                </Button>
                <Button size="large" type="primary" htmlType="submit">
                  Send reset request
                </Button>
              </div>
            </Form>
          </div>
        ) : (
          <div className="message-form">
            <h1>{forgotPassword.title}</h1>
            <p className='message-text'>{forgotPassword.message}</p>
          </div>)
      }
    </div>
  );
}

export default ForgotForm;
