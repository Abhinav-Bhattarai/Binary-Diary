import React, { useMemo } from "react";
import { RequestConfig } from "../../../Container/MainPage/interfaces";
import { RequestIcon } from "../Navbar/logo";
import { MainPageContainer } from "../Reusables/reusables";
import Default from '../../../assets/Images/no-requests.svg';
import RequestCard, {
  ReactButton,
  ReactButtonContainer,
  RequesterImage,
  RequesterUsername,
} from "./request-card";
import "./style.scss";

interface PROPS {
  requestList: Array<RequestConfig> | null;
  AcceptRequest: (index: number) => void;
  DeleteRequest: (index: number) => void;
};

const DefaultRequestContainer: React.FC<{source: string}> = (props) => {
  const { source } = props;
  return (
    <React.Fragment>
      <main id='default-request-container'>
        <img src={source} width='30%' height='30%' alt='default'/>
        <div>No Requests &#128057;</div>
      </main>
    </React.Fragment>
  )
}

const RequestContainerHeader = () => {
  return (
    <div id="request-container-header">
      <div style={{ marginRight: "1%" }}>Follow Requests</div>
      <RequestIcon />
    </div>
  );
};

const RequestContainer: React.FC<PROPS> = (props) => {
  const { requestList, AcceptRequest, DeleteRequest } = props;
  const RequestLists = useMemo(
    () => {
      if (requestList) {
        if (requestList.length > 0) {
          return requestList.map((request, index) => {
            return (
              <RequestCard key={request.extenderID}>
                <RequesterImage source={request.ProfilePicture} />
                <RequesterUsername username={request.Username} />
                <ReactButtonContainer>
                  <ReactButton
                    Click={AcceptRequest.bind(this, index)}
                    name="Confirm"
                    color="#00acee"
                  />
                  <ReactButton
                    Click={DeleteRequest.bind(this, index)}
                    name="Delete"
                    color="#bdbdbd"
                  />
                </ReactButtonContainer>
              </RequestCard>
            );
          });
        }
        return <DefaultRequestContainer source={Default}/>
      }
    }, // eslint-disable-next-line
    [requestList]
  );

  return (
    <React.Fragment>
      <MainPageContainer>
        <RequestContainerHeader />
        {RequestLists}
      </MainPageContainer>
    </React.Fragment>
  );
};

export default React.memo(RequestContainer);
