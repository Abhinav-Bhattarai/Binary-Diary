import React, { useEffect, useState } from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, useQuery } from '@apollo/client';
import { UserInfo } from './interfaces';
import { Context } from './Context';
import { FetchUserData } from '../../GraphQL/main-page-gql';
import LoadingPage from '../../Components/UI/LoadingPage/LoadingPage';

interface PROPS {
    ChangeAuthentication: (type: boolean) => void
};

const client = new ApolloClient({
    uri: 'http://localhost:8000/graphql',
    cache: new InMemoryCache()
});

const MainPageWrapper: React.FC<PROPS> = (props) => {
    return (
        <React.Fragment>
            <ApolloProvider client={client}>
                <MainPage {...props}/>
            </ApolloProvider>
        </React.Fragment>
    )
}

const MainPage: React.FC<PROPS> = (props) => {
    const [user_info, setUserinfo] = useState<UserInfo | null>(null);
    const { loading } = useQuery(FetchUserData, {
        onCompleted: (data) => {
            console.log(data);
        },

        onError: (error) => {
           console.log(error);
        }
    });

    useEffect(() => {
        const auth_token = localStorage.getItem('auth-token');
        const username = localStorage.getItem('username');
        (auth_token && username) && setUserinfo({auth_token, username});
    }, []);

    if (loading === true) {
        return <LoadingPage/>;
    }

    return (
        <React.Fragment>
            <Context.Provider value={{userInfo: user_info}}>
                
            </Context.Provider>
        </React.Fragment>
    )
}

export default MainPageWrapper;