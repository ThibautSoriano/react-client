import React, { Component } from 'react';

import {
    gql,
    graphql,
} from 'react-apollo';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

import VoteTwitt from './VoteTwitt';

class TwittsList extends Component {

  constructor(props) {
    super(props);

    this.state = {twitts: []};
    
  }

  // static propTypes = {
  //   mutate: React.PropTypes.func.isRequired,
  // }
  
  componentWillMount() {
    
    this.props.data.subscribeToMore({
      document: twittsSubscription,
      variables: {
        s: "str",
      },
      updateQuery: (prev, {subscriptionData}) => {
        console.log("subscription triggered");
        if (!subscriptionData.data) {
          return prev;
        }
        const newTwitt = subscriptionData.data.twittAdded;
        
        return Object.assign({}, prev, {twitts: [...prev.twitts, newTwitt]});
      }
    });

    this.props.data.subscribeToMore({
      document: voteForTwittSubscription,
      variables: {
        s: "str",
      },
      updateQuery: (prev, {subscriptionData}) => {
        console.log("VOTES CHANGE", prev);
        if (!subscriptionData.data) {
          return prev;
        }
        const twittWithVotesChanged = subscriptionData.data.votesCountChanged;

        prev.twitts.forEach((currentTwitt) => {
          if (currentTwitt.id == twittWithVotesChanged.id) {
            
            // prev.twitts[index].votesCount = twittWithVotesChanged.votesCount;
            return Object.assign ({}, prev, 
              {
                  twitts: prev.twitts.map((currentTwitt) => {
                    if (currentTwitt.id == twittWithVotesChanged.id) {
                      var obj = JSON.parse(JSON.stringify(currentTwitt));
                      obj.votesCount = twittWithVotesChanged.votesCount;
                      return obj;
                    } else {
                      return currentTwitt;
                    }
                  })
              });
            
            // console.log("current twitt votes: ", currentTwitt);
          }
        });
      
      }
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

    // this.setState({twitts: this.props.data.twitts});
    var sorted = JSON.parse(JSON.stringify(this.props.data.twitts)).sort(compare);
    this.state = {twitts: sorted};
    
    // console.log(sorted);
    return (
      <div style={{ padding: 20 }}>
        <Grid container spacing={24}>
        
      
        { this.state.twitts.map( twitt =>
        (
          <Grid key={twitt.id} item xs={6} sm={3} style={{minHeight: "100px", marginTop: 20}}>
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
          </CardContent>
          <CardActions>
            <VoteTwitt id={twitt.id}/>
          
        </CardActions>
        </Card>
        </Grid>)
      )}
      </Grid>
        
      </div>);
  }
}

function compare(a,b) {
  if (a.votesCount < b.votesCount)
    return 1;
  if (a.votesCount > b.votesCount)
    return -1;
  return 0;
}


const twittsSubscription = gql`
  subscription twittAdded($s: String) {
    twittAdded(s: $s) {
      id
      title
      text
      votesCount
    }
  }
`;

const voteForTwittSubscription = gql`
  subscription votesCountChanged($s: String) {
    votesCountChanged(s: $s) {
      id
      title
      text
      votesCount
    }
  }
`;

export const twittsQuery = gql`
  query twittsQuery {
    twitts {
      id
      title
      text
      votesCount
    }
  }
`;

export default (graphql(twittsQuery)(TwittsList));