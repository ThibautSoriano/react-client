import React, { Component } from 'react';

import {
    gql,
    graphql,
} from 'react-apollo';

import {
  withRouter
} from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

import VoteTwitt from './VoteTwitt';
import AddTwittWithMutation from './AddTwitt';

import LOCAL_STORAGE_TOKEN_KEY from './SessionsList';
import LOCAL_STORAGE_USERNAME_KEY from './SessionsList';

class TwittsList extends Component {

  constructor(props) {
    super(props);
    this.state = {session: {name: '', twitts: []}};
    
  }
  
  componentWillMount() {
    // console.log('ca marche', this.props);
    // this.props.client.query({
    //   query: twittsQuery,
    //   variables: {
    //     id: this.props.match.params.sessionId,
    //     token: this.props.location.state.token
    //   }
    // }).then((resp) => {
    //   // console.log("resp create session pour : ", resp);
    //   this.setState({session: resp.data.sessionById, loading: false});
      
    // });
    
    // const twittsQueryWatch = this.props.client.watchQuery({
    //   query: twittsQuery,
    //   variables: {
    //     id: this.props.match.params.sessionId,
    //     token: this.props.location.state.token
    //   }
    // });
    // console.log(twittsQueryWatch);
    // twittsQueryWatch.subscribeToMore({
    //   document: twittsSubscription,
    //   variables: {
    //     sessionId: this.props.match.params.sessionId,
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
    //   document: twittsSubscription,
    //   variables: {
    //     sessionId: this.props.match.params.sessionId,
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
            
    //         // console.log("current twitt votes: ", currentTwitt);
    //       // }
    //     // });
      
    //   }
    // });
  }

  

  render() {
    
    if (this.props.data.loading) {
      return (<div>Loading</div>)
    }
  
    // if (this.props.data.error) {
    //   console.log(this.props.data.error)
    //   return (<div>An unexpected error occurred</div>)
    // }

    
    // var sorted = JSON.parse(JSON.stringify(this.props.data.twitts)).sort(compare);
    // this.state = {twitts: sorted};
    
    // console.log(sorted);

    console.log(this.props);
    return (
      <div style={{ padding: 20 }}>
        <h1>{this.props.data.sessionById.session.name}</h1>
        <AddTwittWithMutation token={this.props.location.state.token} sessionId={this.props.match.params.sessionId}/>
        <Grid container spacing={24}>
        
        { this.props.data.sessionById.session.twitts.map( twitt =>
        (
          <Grid key={twitt._id} item xs={6} sm={3} style={{minHeight: "100px", marginTop: 20}}>
          <Card>
          <CardContent>
          <Grid item xs={12}>
          <Typography variant="title" component="h2">
            title : {twitt.title}
          </Typography>
          </Grid>
          <Grid item xs={12} style={{ marginTop: 20 }}>
            text : {twitt.text}
          </Grid>
          <Grid item xs={12} style={{ marginTop: 20 }}>
            votes count : <Chip label={twitt.votesCount} />
          </Grid>
          <Grid item xs={12} style={{ marginTop: 20 }}>
            posted by : {twitt.postedBy}
          </Grid>
          </CardContent>
          <CardActions>
            <VoteTwitt id={twitt._id}/>
          
        </CardActions>
        </Card>
        </Grid>)
      )}
      </Grid>
        
      </div>);
  }
}

// function compare(a,b) {
//   if (a.votesCount < b.votesCount)
//     return 1;
//   if (a.votesCount > b.votesCount)
//     return -1;
//   return 0;
// }


const twittsSubscription = gql`
  subscription twittAdded($sessionId: String!) {
    twittAdded(sessionId: $sessionId) {
      _id
      title
      text
      votesCount
      postedBy
    }
  }
`;

const voteForTwittSubscription = gql`
  subscription votesCountChanged($sessionId: String) {
    votesCountChanged(sessionId: $sessionId) {
      _id
      title
      text
      votesCount
      postedBy
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

// export const zheng = gql`
//   query zheng($zhengqin: String) {
//     meurguez(zhengqin: $zhengqin)
//   }
// `;

// export const sessionsQuery = gql`
//   query sessionsQuery {
//     sessions {
//       _id
//       name
//       twitts {
//         _id
//         title
//         text
//         votesCount
//         postedBy
//       }
//     }
//   }
// `;

// export default 
//   (withRouter(TwittsList));
// (withRouter(TwittsList));
export default (graphql(twittsQuery, {
  options: (props) => ({
    variables: { id: props.match.params.sessionId, token: props.location.state.token }
  })
})
(withRouter(TwittsList)));