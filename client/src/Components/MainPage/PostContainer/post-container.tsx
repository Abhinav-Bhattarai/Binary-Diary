import React from 'react';
import { MainPageContainer } from '../Reusables/reusables';

const PostContainer = () => {
    return (
        <React.Fragment>
            <MainPageContainer>
                <h1>PostContainer</h1>
            </MainPageContainer>
        </React.Fragment>
    )
}

export default React.memo(PostContainer);