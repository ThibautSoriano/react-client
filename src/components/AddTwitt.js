import React from 'react';
import { gql, graphql } from 'react-apollo';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


class AddTwitt extends React.Component {
  constructor(props) {
    super(props);

    this.state = {title: "", text: ""};
  }


handleChange = (evt, id) => {
  if (id === 1) {
    this.setState({title:evt.target.value});
  }
  if (id === 2) {
    // state.text = evt.target.value;
    this.setState({text:evt.target.value});
  }
};

  handleClick = (evt) => {
    this.props.mutate({
      variables: {
        sessionId: this.props.sessionId,
        message: this.state.title,
        message2: this.state.text,
        token: this.props.token
      }
    }).then((resp) => {
      console.log("resp : " + resp);
    });
};

render() {
  return (
  <div>
      <h1>You can add twitts and vote</h1>
      
      <TextField
        id="title"
        label="Title"
        value={this.state.title}
        onChange={(e) => this.handleChange(e, 1)}
        style={{ margin: 20 }}
      />
  {/* <input type="text" value={this.state.title} onChange={(e) => this.handleChange(e, 1)} /> */}
  <TextField
        id="text"
        label="Text"
        value={this.state.text}
        onChange={(e) => this.handleChange(e, 2)}
        style={{ margin: 20 }}
      />
  {/* <input type="text" value={this.state.text} onChange={(e) => this.handleChange(e, 2)} /> */}
      <Button variant="raised" color="primary" onClick={this.handleClick} style={{ margin: 20 }}>
        Add twitt
      </Button>
  </div>);
}
}

// const AddTwitt = ({ mutate, match }) => {
//   const handleClick = (evt) => {
//       mutate({
//         variables: {
//           message: "stringtest"
//         },
//         // optimisticResponse: {
//         //   addTwitt: {
//         //     text: evt.target.value,
//         //     id: Math.round(Math.random() * -1000000),
//         //     __typename: 'Message',
//         //   },
//         // },
//         update: (store, { data: { addChannel } }) => {
//           console.log("success");
//         },
//       });
//   };

//   return (
//     <div>
//     <button onClick={handleClick}>
//       Add twitt
//     </button>
//     </div>
//   );
// };

const addTwittMutation = gql`
  mutation addTwitt($sessionId: String!, $message: String!, $message2: String!, $token: String!) {
    addTwitt(sessionId: $sessionId, title: $message, text: $message2, token: $token)
  }
`;


const AddTwittWithMutation = graphql(
  addTwittMutation,
)(AddTwitt);

export default AddTwittWithMutation;

