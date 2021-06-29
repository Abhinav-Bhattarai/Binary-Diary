import React from "react";
import { MainPageContainer } from "../Reusables/reusables";

const RequestContainer = () => {
  return (
    <React.Fragment>
      <MainPageContainer>
        <h1>RequestContainer</h1>
      </MainPageContainer>
    </React.Fragment>
  );
};

export default React.memo(RequestContainer);
