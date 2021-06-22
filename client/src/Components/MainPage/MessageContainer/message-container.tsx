import React from 'react';
import { MainPageContainer } from '../Reusables/reusables';

const MessageContainer = () => {
    return (
        <React.Fragment>
            <MainPageContainer>
                <h1>Messages Container</h1>
            </MainPageContainer>
        </React.Fragment>
    )
};

export default React.memo(MessageContainer);
