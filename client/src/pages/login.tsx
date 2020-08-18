import React from "react";
import { connect } from "react-redux";

import { signInAction, signUpAction, resetPasswordRequestAction } from "../store/actions/login";
import LoginForm from "../components/login/login-form";
import SignUpForm from "../components/login/signup-form";
import ForgotForm from "../components/login/forgot-form";
import { withRouter } from "react-router";

interface IDefaultProps {
  signInAction: Function;
  signUpAction: Function;
  resetPasswordRequestAction: Function;
  history: any;
  location: any;
  match: any;
}

interface IState {
  signIn: {
    username: string;
    password: string;
  };
  signUp: {
    firstName: string;
    secondName: string;
    username: string;
    email: string;
    password_first: string;
    password_second: string;
  };
  forgotPassword: {
    email: string;
    showMessage: boolean;
    title: string;
    message: string;
  };
  authMode: string;
}

class LoginPage extends React.Component<IDefaultProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      signIn: {
        username: "",
        password: "",
      },
      signUp: {
        firstName: "",
        secondName: "",
        username: "",
        email: '',
        password_first: "",
        password_second: "",
      },
      forgotPassword: {
        email: "",
        showMessage: false,
        title: 'Hang in there!',
        message: 'Check your email for message with link to reset your passport.'
      },
      authMode: "SignIn",
    };
  }

  componentDidMount() {
    document.title = "Login | Projer";
  }

  goToHome = () => this.props.history.push("/");

  // LOGIN FORM HANDLERS
  handleLoginMode = (value: string) => {
    this.setState({ authMode: value });
  };

  handleSignInProcess = () => {
    const { signIn } = this.state;
    this.props.signInAction({ ...signIn, goToHome: this.goToHome });
  };

  handleSignUpProcess = () => {
    const { signUp } = this.state;
    this.props.signUpAction({
      ...signUp,
      handleLoginMode: this.handleLoginMode,
    });
  };


  // SIGN IN DATA HANDLER

  handleSignInState = (field: string, value: string) => {
    this.setState({
      signIn: {...this.state.signIn, [field]: value}
    })
  };

  // SIGN UP DATA HANDLERS

  handleSignUpState = (field: string, value: string) => {
    this.setState({
      signUp: {...this.state.signUp, [field]: value}
    })
  }

  // FORGOT FORM MESSAGE DATA HANDLERS

  handleForgotMessageState = (data: {
    showMessage: boolean,
    title: string,
    message: string
  }) => {
    this.setState({
      forgotPassword: {
        ...this.state.forgotPassword,
        ...data
      }
    })
  }

  // FORGOT PASSWORD FORM

  handleForgotState = (field: string, value: string) => {
    this.setState({
      forgotPassword: {
        ...this.state.forgotPassword,
        [field]: value
      }
    })
  }

  handleReturnToLogin = () => {
      this.handleForgotMessageState({
        showMessage: true,
        title: 'Hang in there!',
        message: 'Check your email for message with link to reset your passport.'
      })
      setTimeout(() => {
        this.handleLoginMode('SignIn');
        this.setState({
          forgotPassword: {
            ...this.state.forgotPassword,
            showMessage: false,
            title: '',
            message: ''
          }
        });
      }, 10000);
  }

  handlePasswordReset = () => {
    const { email } = this.state.forgotPassword;
    this.props.resetPasswordRequestAction({
      email,
      handleReturnToLogin: this.handleReturnToLogin
    })
  }

  render() {
    const { signIn, signUp, forgotPassword, authMode } = this.state;

    return (
      <div className="login">
        {authMode === "SignIn" ? (
          <LoginForm
            username={signIn.username}
            password={signIn.password}
            handleSignInState={this.handleSignInState}
            handleLoginMode={this.handleLoginMode}
            handleSignInProcess={this.handleSignInProcess}
          />
        ) : authMode === "SignUp" ? (
          <SignUpForm
            email={signUp.email}
            username={signUp.username}
            firstName={signUp.firstName}
            secondName={signUp.secondName}
            password_first={signUp.password_first}
            password_second={signUp.password_second}
            handleSignUpState={this.handleSignUpState}
            handleSignUpProcess={this.handleSignUpProcess}
            handleLoginMode={() => this.handleLoginMode("SignIn")}
          />
        ) : authMode === "ForgotPassword" ? (
          <ForgotForm
            forgotPassword={forgotPassword}
            handleLoginMode={this.handleLoginMode}
            handleForgotState={this.handleForgotState}
            handlePasswordReset={this.handlePasswordReset}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

const mapStateToProps = (store: any) => ({});

const mapDispatchToProps = {
  signInAction,
  signUpAction,
  resetPasswordRequestAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LoginPage));
