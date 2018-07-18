import React from 'react';

import {
    gql,
    graphql,
} from 'react-apollo';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const AddSession = ({ mutate }) => {
  let name = "ee";

    function handleClick(evt, name) {
        mutate({
          variables: {
            name: name
          }
        }).then((resp) => {
          console.log("resp create session pour : " + resp);
        });
    };

    function handleChange (evt) {
      // this.setState({name: evt.target.value});
      name = evt.target.value;
      console.log(name);
    };

  return (
    <div>
    <TextField
      id="text"
      label="Text"
      value={name}
      onChange={(e) => handleChange(e)}
      style={{ margin: 20 }}
    />
    <Button onClick={(e) => handleClick(e, name)}>Create session</Button>
    </div>
  );
};

const addSessionMutation = gql`
  mutation addSessionMutation($name: String!) {
    addSession(name: $name)
  }
`;



const AddSessionWithMutation = graphql(
  addSessionMutation,
)(AddSession);

export default AddSessionWithMutation;
