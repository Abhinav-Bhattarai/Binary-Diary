import React from "react";

export interface NavbarProps {
  value: string;
  change: (event: React.ChangeEvent<HTMLInputElement>) => void;
  HomePressHandler: (event: React.MouseEvent<HTMLDivElement>) => void;
  SuggestionPressHandler: (event: React.MouseEvent<HTMLDivElement>) => void;
  MessagesPressHandler: (event: React.MouseEvent<HTMLDivElement>) => void;
  ProfilePressHandler: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export interface ProfileAreaProps {
  Username: string | undefined;
  source: string;
}
export interface SearchBarProps {
  value: string;
  change: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  name: string;
  type: "text" | "password" | "email";
}

export interface LogoProps {
  source: string;
  width: string;
  height: string;
}
