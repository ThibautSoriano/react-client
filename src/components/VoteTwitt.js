import React from 'react';

import {
    gql,
    graphql,
} from 'react-apollo';
import Button from '@material-ui/core/Button';



const VoteTwitt = ({ mutate, id }) => {
    function handleClick(evt, id) {
        mutate({
          variables: {
            id: id
          }
        }).then((resp) => {
          console.log("resp vote pour : " + resp);
        });
    };

  return (
    <Button onClick={(e) => handleClick(e, id)}>Voter pour</Button>
  );
};

const voteForTwittMutation = gql`
  mutation voteForTwitt($id: ID!) {
    voteForTwitt(id: $id)
  }
`;



const VoteTwittWithMutation = graphql(
    voteForTwittMutation,
)(VoteTwitt);

export default VoteTwittWithMutation;
