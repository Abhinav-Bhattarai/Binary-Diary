import React from 'react';
import './reusable.scss';

export const MainPageContainer: React.FC<{}> = ({ children }) => {
    return (
        <React.Fragment>
            <main id='main-mainpage-container'>
                { children }
            </main>
        </React.Fragment>
    )
};

export const BigPopupContainer: React.FC<{}> = ({ children }) => {
    return (
        <React.Fragment>
            <main id='big-popup-container'>
                { children }
            </main>
        </React.Fragment>
    )
};