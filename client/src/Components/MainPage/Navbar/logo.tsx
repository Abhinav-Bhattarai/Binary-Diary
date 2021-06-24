import { BiHome, BiNews } from "react-icons/bi";
import { RiMessengerLine } from "react-icons/ri";
import { IconContext } from "react-icons";
import "./navbar.scss";

export const HomeIcon = () => {
  return (
    <IconContext.Provider value={{ className: "icon home-icon" }}>
      <BiHome />
    </IconContext.Provider>
  );
};

export const SuggesstionIcon = () => {
  return (
    <IconContext.Provider value={{ className: "icon suggestion-icon" }}>
      <BiNews />
    </IconContext.Provider>
  );
};

export const MessageIcon = () => {
  return (
    <IconContext.Provider value={{ className: "icon message-icon" }}>
      <RiMessengerLine />
    </IconContext.Provider>
  );
};
