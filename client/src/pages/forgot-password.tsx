import React from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router";
import { Input, Button, Form } from "antd";

import { getUrlParam } from "../utils/utils";
import { resetPasswordConfirmAction } from "../store/actions/login";

const { Item } = Form;

interface IDefaultProps extends RouteComponentProps<any> {
  resetPasswordConfirmAction: Function;
}

interface IDefaultState {
  password_first: string;
  password_second: string;
  token: string;
  email: string;
  showMessage: boolean;
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

class ForgotPasswordForm extends React.Component<IDefaultProps, IDefaultState> {
  constructor(props: any) {
    super(props);

    this.state = {
      password_first: "",
      password_second: "",
      token: getUrlParam("token") || "",
      email: getUrlParam("email") || "",
      showMessage: false,
    };
  }

  componentDidMount() {
    const { token, email } = this.state;
    document.title = "Reset password | Projer";
    if (!token || !email) {
      this.props.history.goBack();
    }
  }

  handleForgotPasswords = (field: string, value: string) => {
    this.setState({
      ...this.state,
      [field]: value,
    });
  };

  handleHoldedLoginRedirect = () => {
    this.setState({
      ...this.state,
      showMessage: true
    }, () => {
      setTimeout(() => {
        this.props.history.push('/login');
      }, 5000);
    })
  }

  handleConfirmResetPassword = () => {
    const { token, email } = this.state;

    this.props.resetPasswordConfirmAction({
      token,
      mail: email,
      password: this.state.password_second,
      handleHoldedLoginRedirect: this.handleHoldedLoginRedirect
    });
  };

  render() {
    const { 
      password_first, 
      password_second, 
      showMessage 
    } = this.state;

    return (
      <div className="forgot-form-container">
        <div className="forgot-form">
          {
            !showMessage ? (
              <>
                <h1>Almost done</h1>
                <Form {...layout} onFinish={() => this.handleConfirmResetPassword()}>
                  <Item
                    label="New password"
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
                      onChange={(e) =>
                        this.handleForgotPasswords("password_first", e.target.value)
                      }
                    />
                  </Item>
                  <Item
                    label="Confirm password"
                    name="confirm_password"
                    rules={[
                      { required: true, message: "Please input your password!" },
                      {
                        pattern: new RegExp(`${password_first}`, "g"),
                        message: "Passwords should be equal!",
                      },
                    ]}
                  >
                    <Input.Password
                      value={password_second}
                      onChange={(e) =>
                        this.handleForgotPasswords("password_second", e.target.value)
                      }
                    />
                  </Item>

                  <div className="forgot-buttons">
                    <Button size="large" onClick={() => {}}>
                      Sign In
                    </Button>
                    <Button size="large" type="primary" htmlType="submit">
                      Send reset request
                    </Button>
                  </div>
                </Form>
              </>
            ) : (
              <>
                <h2>SUCCESS!</h2>
                <p className='message-text'>
                  Your password has been changed. Redirecting to 'Sign In' page...
                </p>
              </>
            )
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store: any) => ({});

const mapDispatchToProps = {
  resetPasswordConfirmAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ForgotPasswordForm));
