import React, { Suspense } from "react";
import LoadingPage from "../Components/UI/LoadingPage/LoadingPage";

interface LPGuardProps {
  auth_status: boolean;
  ChangeAuthentication: (type: boolean) => void;
}

const AsyncLandingPage = React.lazy(
  () => import("../Container/LandingPage/landingpage")
);
const AsyncMainPage = React.lazy(
  () => import("../Container/MainPage/mainpage")
);

export const LandingPageGuard: React.FC<LPGuardProps> = (props) => {
  const { auth_status, ChangeAuthentication } = props;

  if (auth_status === false) {
    return (
      <React.Fragment>
        <Suspense fallback={<LoadingPage />}>
          <AsyncLandingPage ChangeAuthentication={ChangeAuthentication} />
        </Suspense>
      </React.Fragment>
    );
  }
  return null;
};

export const MainPageGuard: React.FC<LPGuardProps> = (props) => {
  const { auth_status, ChangeAuthentication } = props;
  if (auth_status === true) {
    return (
      <React.Fragment>
        <Suspense fallback={<LoadingPage />}>
          <AsyncMainPage ChangeAuthentication={ChangeAuthentication} />
        </Suspense>
      </React.Fragment>
    );
  }
  return null;
};
