import React from 'react';

export const MainPageContainer: React.FC<{}> = ({ children }) => {
    return (
        <React.Fragment>
            <main id='main-mainpage-container'>
                { children }
            </main>
        </React.Fragment>
    )
};