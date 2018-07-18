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
import AddSessionWithMutation from './AddSession';
import SessionsSubscription from './SessionsSubscription';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// import Chip from '@material-ui/core/Chip';

export const LOCAL_STORAGE_USERNAME_KEY = "react-twitts-username";
export const LOCAL_STORAGE_TOKEN_KEY = "react-twitts-token";

class SessionsList extends Component {

  constructor(props) {
    super(props);
    
  }

  handleSessionNameChange (evt) {
    this.setState({createSessionName: evt.target.value});
  };

  handleUserNameChange (evt) {
    this.setState({userName: evt.target.value});
  };

  componentWillMount() {
    let userName = localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);
    if (userName === undefined || userName === null) {
      userName = "";
    }
    this.setState({createSessionName: "", userName: userName });
    // this.props.data.subscribeToMore({
    //   document: twittsSubscription,
    //   variables: {
    //     s: "str",
    //   },
    //   updateQuery: (prev, {subscriptionData}) => {
    //     console.log("subscription triggered");
    //     if (!subscriptionData.data) {
    //       return prev;
    //     }
    //     const newTwitt = subscriptionData.data.twittAdded;
        
    //     return Object.assign({}, prev, {twitts: [...prev.twitts, newTwitt]});
    //   }
    // });

    // this.props.data.subscribeToMore({
    //   document: voteForTwittSubscription,
    //   variables: {
    //     s: "str",
    //   },
    //   updateQuery: (prev, {subscriptionData}) => {
    //     console.log("VOTES CHANGE", prev);
    //     if (!subscriptionData.data) {
    //       return prev;
    //     }
    //     const twittWithVotesChanged = subscriptionData.data.votesCountChanged;

    //     // prev.twitts.forEach((currentTwitt) => {
    //       // if (currentTwitt.id == twittWithVotesChanged.id) {
            
    //         // prev.twitts[index].votesCount = twittWithVotesChanged.votesCount;
    //         return Object.assign ({}, prev, 
    //           {
    //               twitts: prev.twitts.map((currentTwitt) => {
    //                 if (currentTwitt._id === twittWithVotesChanged._id) {
    //                   var obj = JSON.parse(JSON.stringify(currentTwitt));
    //                   obj.votesCount = twittWithVotesChanged.votesCount;
    //                   return obj;
    //                 } else {
    //                   return currentTwitt;
    //                 }
    //               })
    //           });
    //   }
    // });
  }

  handleClick(evt) {
    this.props.client.mutate({
      mutation: addSessionMutation,
      variables: {
        name: this.state.createSessionName
      }
    }).then((resp) => {
      console.log("resp create session pour : ", resp);
    });
    // this.props.client.query({
    //   query: sessionsQuery,
      
    // }).then((resp) => {
    //   console.log("resp create session pour : ", resp);
    // });
  }

  createUser(evt) {
    this.props.client.mutate({
      mutation: createUserMutation,
      variables: {
        name: this.state.userName
      }
    }).then((resp) => {
      console.log("resp create USER, token : ", resp);
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, resp.data.createUser.token);
      localStorage.setItem(LOCAL_STORAGE_USERNAME_KEY, resp.data.createUser.name);
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

    // var sorted = JSON.parse(JSON.stringify(this.props.data.twitts)).sort(compare);
    // this.state = {twitts: sorted};
    
    return (
      <div style={{ padding: 20 }}>
      <TextField
          label="User name"
          value={this.state.userName}
          onChange={(e) => this.handleUserNameChange(e)}
          style={{ margin: 20 }}
        />
      <Button onClick={() => this.createUser()}>Create user</Button>
      <SessionsSubscription client={this.props.client} sessionId={this.props.match.params.sessionId}/>
        {/* <Grid container spacing={24}>
        
      
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
      </Grid> */}

        <TextField
          id="text"
          label="Text"
          value={this.state.createSessionName}
          onChange={(e) => this.handleSessionNameChange(e)}
          style={{ margin: 20 }}
        />
<Button onClick={(e) => this.handleClick(e)}>Create session</Button>
        
      </div>);
  }
}

// const twittsSubscription = gql`
//   subscription twittAdded($s: String) {
//     twittAdded(s: $s) {
//       _id
//       title
//       text
//       votesCount
//     }
//   }
// `;

// const voteForTwittSubscription = gql`
//   subscription votesCountChanged($s: String) {
//     votesCountChanged(s: $s) {
//       _id
//       title
//       text
//       votesCount
//     }
//   }
// `;
const addSessionMutation = gql`
  mutation addSessionMutation($name: String!) {
    addSession(name: $name)
  }
`;

const createUserMutation = gql`
  mutation createUserMutation($name: String!) {
    createUser(name: $name) {
      name,
      token
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

export default (graphql(sessionsQuery)(withRouter(SessionsList)));