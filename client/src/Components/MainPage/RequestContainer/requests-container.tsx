import React, { useMemo } from "react";
import { RequestConfig } from "../../../Container/MainPage/interfaces";
import { MainPageContainer } from "../Reusables/reusables";
import RequestCard from "./request-card";

interface PROPS {
  requestList: Array<RequestConfig> | null;
}

const RequestContainer: React.FC<PROPS> = (props) => {
  const { requestList } = props;
  const RequestLists = useMemo(() => {
    if (requestList) {
      if (requestList.length > 0) {
        requestList.map((request) => {
          return <RequestCard key={request.extenderID} />;
        });
      }
    }
  }, [requestList]);
  
  return (
    <React.Fragment>
      <MainPageContainer>
        <h1>hello</h1>
        {RequestLists}
      </MainPageContainer>
    </React.Fragment>
  );
};

export default React.memo(RequestContainer);
