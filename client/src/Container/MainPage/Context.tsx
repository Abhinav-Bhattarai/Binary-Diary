import React from 'react';
import { UserInfo } from './interfaces';

interface contextData{
    userInfo: UserInfo | null;
    ProfilePicture: string;
};

export const Context = React.createContext<contextData>({
    userInfo: null,
    ProfilePicture: ''
});