import React from "react";
import UnderConstruction from "../../../assets/Images/underconstruction.svg";
import { MainPageContainer } from "../Reusables/reusables";

interface PROPS {}

const MessageContainer: React.FC<PROPS> = () => {
  return (
    <React.Fragment>
      <MainPageContainer>
        <img
          src={UnderConstruction}
          width="30%"
          height="auto"
          style={{
            marginTop: "100px",
          }}
          alt="under-construction"
        />
        <h2>Messages Soon</h2>
      </MainPageContainer>
    </React.Fragment>
  );
};

export default React.memo(MessageContainer);
