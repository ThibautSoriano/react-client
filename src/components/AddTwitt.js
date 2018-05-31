import React from 'react';
import { gql, graphql } from 'react-apollo';
import { withRouter } from 'react-router';

const AddTwitt = ({ mutate, match }) => {
  const handleClick = (evt) => {
      mutate({
        variables: {
          message: "stringtest"
        },
        // optimisticResponse: {
        //   addTwitt: {
        //     text: evt.target.value,
        //     id: Math.round(Math.random() * -1000000),
        //     __typename: 'Message',
        //   },
        // },
        update: (store, { data: { addChannel } }) => {
          console.log("success");
        },
      });
  };

  return (
    <div>
    <button onClick={handleClick}>
      Add twitt
    </button>
    </div>
  );
};

const addTwittMutation = gql`
  mutation addTwitt($message: String!) {
    addTwitt(message: $message)
  }
`;


const AddTwittWithMutation = graphql(
  addTwittMutation,
)(withRouter(AddTwitt));

export default AddTwittWithMutation;
