import React from "react";
import { ImCross } from "react-icons/im";
import { IconContext } from "react-icons";
import "./reusable.scss";
import { Logo } from "../ProfileContainer/reusables";
import { AiOutlinePlus } from "react-icons/ai";

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
interface MainPageContainerProps {
  popup?: boolean | null;
  Exit?: () => void;
}

export const MainPageContainer: React.FC<MainPageContainerProps> = React.memo(
  (props) => {
    console.log("MainPage rendered");
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

const BigPopupContainer: React.FC<{ status: string; ID: string }> = ({
  children,
  status,
  ID,
}) => {
  return (
    <React.Fragment>
      <main id={ID} className="big-popup-container">
        {children}
      </main>
    </React.Fragment>
  );
};
export default BigPopupContainer;

export const PopupHeader: React.FC<{ name: string; Exit: () => void }> = ({
  name,
  Exit,
}) => {
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

export const PopupImageContainer: React.FC<{
  source: string | null;
  Click: () => void;
}> = ({ source, Click }) => {
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

interface ImageSelectorProps {
  backgroundColor: string;
  Click: () => void;
  name: string;
}

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
