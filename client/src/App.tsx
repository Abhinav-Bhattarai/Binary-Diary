import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { LandingPageGuard, MainPageGuard } from "./Guards/Auth-guards";

function App() {
  const [auth_status, setAuthStatus] = useState<null | boolean>(null);
  // null represents the status is not decided

  useEffect(() => {
    const AuthenticationCheck = async (): Promise<void> => {
      const token = localStorage.getItem("auth-token");
      const username = localStorage.getItem("username");
      if (token && username) {
        const config = { token, username };
        const { data } = await axios.post("http://localhost/check-auth", config);
        if (data.error === false) setAuthStatus(data.auth_status);
      } else {
        setAuthStatus(false);
      }
    };
    AuthenticationCheck();
  }, []);

  const ChangeAuthentication = (type: boolean): void => {
    if (type === false) localStorage.clear();
    setAuthStatus(type);
  };

  if (auth_status !== null) {
    return (
      <React.Fragment>
        <BrowserRouter>
          <LandingPageGuard
            ChangeAuthentication={ChangeAuthentication}
            auth_status={auth_status}
          />
          <MainPageGuard
            ChangeAuthentication={ChangeAuthentication}
            auth_status={auth_status}
          />
        </BrowserRouter>
      </React.Fragment>
    );
  }
  return <React.Fragment></React.Fragment>;
}

export default App;