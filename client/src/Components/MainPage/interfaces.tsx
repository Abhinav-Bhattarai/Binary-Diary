import React from "react";

export interface NavbarProps {
  value: string;
  change: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
