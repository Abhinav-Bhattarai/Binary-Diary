import React from 'react';
import { RequestIcon } from '../Navbar/logo';
import "./style.scss";

export const DefaultRequestContainer: React.FC<{source: string}> = (props) => {
  const { source } = props;
  return (
    <React.Fragment>
      <main id='default-request-container'>
        <img src={source} width='30%' height='30%' alt='default'/>
        <div>No Requests Found !</div>
      </main>
    </React.Fragment>
  )
}

export const RequestContainerHeader = () => {
  return (
    <div id="request-container-header">
      <div style={{ marginRight: "1%" }}>Follow Requests</div>
      <RequestIcon />
    </div>
  );
};