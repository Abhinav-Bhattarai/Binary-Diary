import React from "react";
import { MainPageContainer } from "../Reusables/reusables";

interface PROPS {};

const MessageContainer: React.FC<PROPS> = () => {
  return (
    <React.Fragment>
      <MainPageContainer>
        <h1>Messages Container</h1>
      </MainPageContainer>
    </React.Fragment>
  );
};

export default React.memo(MessageContainer);