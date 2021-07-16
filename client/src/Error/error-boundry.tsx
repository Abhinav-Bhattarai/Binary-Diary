import React from "react";

class ErrorBoundry extends React.Component {
  state = {
    errorStatus: false,
  };
  componentDidCatch() {
    if (this.state.errorStatus === false) this.setState({ errorStatus: true });
  }
  render() {
    const { children } = this.props;
    if (this.state.errorStatus === true) return <></>;
    return <React.Fragment>{children}</React.Fragment>;
  }
}

export default ErrorBoundry;