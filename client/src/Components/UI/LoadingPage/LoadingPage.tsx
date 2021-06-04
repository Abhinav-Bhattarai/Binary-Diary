import React from "react";
import GithubLogo from "../../../assets/Images/github.svg";
import './LoadingPage.scss';

const Loader: React.FC<{}> = () => {
  return (
    <div>
      <img
        src={GithubLogo}
        width="60px"
        height="60px"
        id="loader-img"
        alt="loader"
      />
    </div>
  );
};

const LoadingPage = () => {
  return (
    <React.Fragment>
      <main className="loading-page-container">
        <Loader />
      </main>
    </React.Fragment>
  );
};

export default LoadingPage;