import React, { useMemo } from "react";
import { RequestConfig } from "../../../Container/MainPage/interfaces";
import { MainPageContainer } from "../Reusables/reusables";
import Default from '../../../assets/Images/no-requests.svg';
import RequestCard, {
  ReactButton,
  ReactButtonContainer,
  RequesterImage,
  RequesterUsername,
} from "./request-card";
import "./style.scss";
import { DefaultRequestContainer, RequestContainerHeader } from "./resusables";

interface PROPS {
  requestList: Array<RequestConfig> | null;
  AcceptRequest: (index: number) => void;
  DeleteRequest: (index: number) => void;
};

const RequestContainer: React.FC<PROPS> = (props) => {
  const { requestList, AcceptRequest, DeleteRequest } = props;
  console.log('rendered requestcontainer')
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
        {requestList && requestList.length > 0 && <RequestContainerHeader />}
        {RequestLists}
      </MainPageContainer>
    </React.Fragment>
  );
};

export default React.memo(RequestContainer);
