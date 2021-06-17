import React from "react";
import "./reusable.scss";

interface MainPageContainerProps {
  popup?: boolean | null;
  Exit?: () => void;
}

export const MainPageContainer: React.FC<MainPageContainerProps> = React.memo(
  (props) => {
    const { children, popup, Exit } = props;
    const blur = popup === true ? "3px" : "0px";
    const JSX = () => {
      return (
        <main
          id="main-mainpage-container"
          style={{
            filter: `blur(${blur})`,
          }}
          onClick={popup === true ? Exit : undefined}
        >
          {children}
        </main>
      );
    };
    return (
      <React.Fragment>
        <JSX />
      </React.Fragment>
    );
  }
);

export const BigPopupContainer: React.FC<{ status: string, ID: string }> = ({
  children,
  status,
  ID
}) => {
  return (
    <React.Fragment>
      <main id={ID} className='big-popup-container'>{children}</main>
    </React.Fragment>
  );
};

export const PopupHeader: React.FC<{ name: string; Exit: () => void }> = ({
  name,
}) => {
  return <header id="popup-header">{name}</header>;
};

export const PopupImageContainer: React.FC<{ source: string | null; Click: () => void }> = ({
  source,
  Click
}) => {
  return (
    <main id="popup-img-container" onClick={Click}>
      {source ? (
        <img src={source} alt="popuplogo" />
      ) : (
        <div style={{ fontWeight: "bold" }}>No Image Selected</div>
      )}
    </main>
  );
};

interface ImageSelectorProps {
  backgroundColor: string;
  Click: () => void;
  name: string;
}

export const ImageSelector: React.FC<ImageSelectorProps> = (props) => {
  const { backgroundColor, Click, name } = props;
  return (
    <button type="button" id='image-selector-btn' onClick={Click} style={{ backgroundColor }}>
      {name}
    </button>
  );
};