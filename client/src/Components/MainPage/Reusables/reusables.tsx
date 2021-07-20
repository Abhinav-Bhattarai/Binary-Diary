import React from "react";
import { ImCross } from "react-icons/im";
import { IconContext } from "react-icons";
import "./reusable.scss";
import { Logo } from "../ProfileContainer/reusables";
import { AiOutlinePlus } from "react-icons/ai";
import PopupSpinner from "../../UI/Spinner/PopupSpinner/popup-spinner";

// interfaces
interface MainPageContainerProps {
  popup?: boolean | null;
  Exit?: () => void;
};
interface PopupHeaderProps { name: string; Exit: () => void }
interface PopupImageContainerProps {
  source: string | null;
  Click: () => void;
};
interface ImageSelectorProps {
  backgroundColor: string;
  Click: () => void;
  name: string;
}

const ExitIcon = () => {
  return (
    <IconContext.Provider
      value={{
        style: {
          fontSize: "14px",
          color: "#ff385c",
          cursor: "pointer",
        },
      }}
    >
      <ImCross />
    </IconContext.Provider>
  );
};

export const MainPageContainer: React.FC<MainPageContainerProps> = React.memo(
  (props) => {
    const { children, popup, Exit } = props;
    const blur = popup === true ? "3px" : "0px";
    return (
      <React.Fragment>
        <main
          id="main-mainpage-container"
          style={{
            filter: `blur(${blur})`,
          }}
          onClick={popup === true ? Exit : undefined}
        >
          {children}
        </main>
      </React.Fragment>
    );
  }
);

const PopupContainerAbsLoader = () => {
  return (
    <div id='popup-container-abs-loader'>
      <PopupSpinner/>
    </div>
  )
}

const BigPopupContainer: React.FC<{ status: string; ID: string, ProcessingStatus: boolean }> = (props) => {
  const { children, ID, ProcessingStatus } = props;
  return (
    <React.Fragment>
      <main id={ID} className="big-popup-container">
        {children}
        {ProcessingStatus && <PopupContainerAbsLoader/>}
      </main>
    </React.Fragment>
  );
};
export default BigPopupContainer;

export const PopupHeader: React.FC<PopupHeaderProps> = ({ name, Exit }) => {
  return (
    <header id="popup-header">
      <span
        style={{
          position: "absolute",
          top: "25px",
          left: "3%",
        }}
        onClick={Exit}
      >
        <ExitIcon />
      </span>
      {name}
    </header>
  );
};

export const PopupImageContainer: React.FC<PopupImageContainerProps> = ({ source, Click }) => {
  return (
    <main id="popup-img-container" onClick={Click}>
      <div
        style={{
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {source ? (
          <img src={source} alt="popuplogo" />
        ) : (
          <>
            <div style={{ marginBottom: "40px" }}>No Image Selected</div>
            <Logo>
              <AiOutlinePlus />
            </Logo>
          </>
        )}
      </div>
    </main>
  );
};

export const ImageSelector: React.FC<ImageSelectorProps> = (props) => {
  const { backgroundColor, Click, name } = props;
  return (
    <button
      type="button"
      id="image-selector-btn"
      onClick={Click}
      style={{ backgroundColor }}
    >
      {name}
    </button>
  );
};