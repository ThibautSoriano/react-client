import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

import {
  BrowserRouter,
  Link,
  Route,
  Switch,
} from 'react-router-dom';

import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo';

import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import AddTwitt from './components/AddTwitt';
import TwittsList from './components/TwittsList';
import SessionsList from './components/SessionsList';

// interface for queries
// const networkInterface = createNetworkInterface({ uri: 'https://thibaut-server.herokuapp.com/graphql' });
const networkInterface = createNetworkInterface({ uri: 'http://localhost:4000/graphql' });
networkInterface.use([{
  applyMiddleware(req, next) {
    setTimeout(next, 500);
  },
}]);

// interface for subscription
const wsClient = new SubscriptionClient(`ws://localhost:4000/subscriptions`, {
// const wsClient = new SubscriptionClient(`wss://thibaut-server.herokuapp.com/subscriptions`, {
  reconnect: true,
});

// interface with both
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
            <div className="App">
              {/* <Link to="/" className="navbar">React + GraphQL Tutorial</Link> */}
              <Switch>
                {/* <SessionsList  client={client}></SessionsList> */}
                <Route exact path="/" render={()=><SessionsList client={client}/>}/>
                <Route path="/session/:sessionId" component={TwittsList}/>
                {/* render={()=><TwittsList client={client}/>} */}
              </Switch>
            </div>
          </BrowserRouter>
        {/* <div className="App"> */}
          
          {/* <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header> */}
          
          {/* <AddTwitt client={client}></AddTwitt> */}
          {/* <TwittsList client={client}></TwittsList> */}
        {/* </div> */}
      </ApolloProvider>
    );
  }
}

export default App;
