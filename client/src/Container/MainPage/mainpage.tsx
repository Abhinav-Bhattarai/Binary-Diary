import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:8000/graphql',
    cache: new InMemoryCache()
});

const MainPage = () => {
    return (
        <React.Fragment>
            <ApolloProvider client={client}>
                
            </ApolloProvider>
        </React.Fragment>
    )
}

export default MainPage;
