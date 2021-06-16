import React from "react";
import "./reusable.scss";

export const MainPageContainer: React.FC<{ popup?: boolean; Exit?: () => void }> = React.memo((props) => {
    const { children, popup, Exit } = props;
    const JSX = () => {
      return (
        <main id="main-mainpage-container" onClick={popup === true ? Exit : undefined}>
          {children}
        </main>
      );
    };
    return (
      <React.Fragment>
        <JSX />
      </React.Fragment>
    );
  });

export const BigPopupContainer: React.FC<{status: string}> = ({ children, status }) => {
  return (
    <React.Fragment>
      <main id="big-popup-container">{children}</main>
    </React.Fragment>
  );
};

export const PopupHeader: React.FC<{ name: string; Exit: () => void }> = ({
  name,
}) => {
  return <header id="popup-header">{name}</header>;
};

export const PopupImageContainer: React.FC<{ source: string | null }> = ({
  source,
}) => {
  return (
    <main id="popup-img-container">
      {source ? (
        <img src={source} alt="popuplogo" />
      ) : (
        <h1>No Photo Selected</h1>
      )}
    </main>
  );
};
