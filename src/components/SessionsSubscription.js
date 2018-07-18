import React, { Component } from 'react';

import {
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';

import {
    gql,
    graphql,
} from 'react-apollo';
import Button from '@material-ui/core/Button';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// import Chip from '@material-ui/core/Chip';

export const LOCAL_STORAGE_USERNAME_KEY = "react-twitts-username";
export const LOCAL_STORAGE_TOKEN_KEY = "react-twitts-token";

class SessionsSubscription extends Component {

  constructor(props) {
    super(props);
    
  }

  componentWillMount() {
    console.log(this.props);
    this.props.data.subscribeToMore({
      document: sessionsSubscription,
      variables: {
        s: "str",
      },
      updateQuery: (prev, {subscriptionData}) => {
        console.log("subscription triggered");
        if (!subscriptionData.data) {
          return prev;
        }
        const newSession = subscriptionData.data.sessionAdded;
        
        return Object.assign({}, prev, {sessions: [...prev.sessions, newSession]});
      }
    });
  }


  requestSession(sessionId, token) {
    console.log("send request session", this.props);
    this.props.client.query({
      query: twittsQuery,
      variables: {
        id: sessionId,
        token: token
      }
    }).then((resp) => {
      console.log("resp get session pour : ", resp);
      this.setState({session: resp.data.sessionById, loading: false});
      
    });
  }

  render() {
    
    if (this.props.data.loading) {
      return (<div>Loading</div>)
    }
  
    if (this.props.data.error) {
      console.log(this.props.data.error)
      return (<div>An unexpected error occurred</div>)
    }
    
    return (
      <div style={{ padding: 20 }}>
        <Grid container spacing={24}>
  
        { this.props.data.sessions.map( session =>
        (
          <Grid key={session._id} item xs={6} sm={3} style={{minHeight: "100px", marginTop: 20}}>
          <Card>
          <CardContent>
          <Grid item xs={12}>
          <Typography variant="title" component="h2">
            name : {session.name}
          </Typography>
          </Grid>
          </CardContent>
          <CardActions>

          <Button onClick={() => {
            let token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
            if (token === undefined || token === null) {
              alert("choose your name first and validate it");
            } else {
              {/* this.requestSession(session._id, token); */}
              
              this.props.history.push({
  pathname: `/session/${session._id}`,
  state: { token: token, sessionId: session._id }
}
)
            }
          }}>Rejoindre</Button>
          
        </CardActions>
        </Card>
        </Grid>)
      )}
      </Grid>
        
      </div>);
  }
}

const sessionsSubscription = gql`
  subscription sessionAdded($s: String) {
    sessionAdded(sessionId: $s) {
      _id
      name
      twitts {
        _id
        title
        text
        votesCount
        postedBy
      }
    }
  }
`;

export const sessionsQuery = gql`
  query sessionsQuery {
    sessions {
      _id
      name
      twitts {
        _id
        title
        text
        votesCount
        postedBy
      }
    }
  }
`;

export const twittsQuery = gql`
  query twittsQuery($id: String!, $token: String!) {
    sessionById(sessionId: $id, userToken: $token) {
      session {
        _id
        name
        twitts {
          _id
          title
          text
          votesCount
          postedBy
        }
        usersVotes {
          user_id
          votesLeft
        }
      }
      votesLeft
    }
  }
`;


export default (graphql(sessionsQuery)(withRouter(SessionsSubscription)));