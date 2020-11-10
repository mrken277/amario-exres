import * as compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import React from 'react';

class Form extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        name: '',
        description: '',
      }
    }

    onChangeName = (e) => {
      this.setState({ name: e.currentTarget.value });
    }

    onChangeDescription = (e) => {
      this.setState({ description: e.currentTarget.value });
    }

    onSubmit = (e) => {
      e.preventDefault();

      this.props.carCreate({
        variables: {
          name: this.state.name,
          description: this.state.description
        }
      }).then(() => {
        location.pathname = '/erxes-plugin-car/list';
      })
    }

    render() {
      return (
          <div>
            <form onSubmit={this.onSubmit}>
                <p>
                  <label>Name: </label> <br />

                  <input onChange={this.onChangeName} value={this.state.name} />
                </p>

                <p>
                  <label>Description: </label> <br />

                  <textarea onChange={this.onChangeDescription} value={this.state.description}></textarea>
                </p>

                <p>
                  <button type="submit">Submit</button>
                </p>
            </form>
          </div>
      )
    }
}

export default compose(
    graphql(
      gql(`
        mutation carCreate($name: String, $description: String) {
          carCreate(name: $name, description: $description) {
            name
            description
          }
        }
      `),
      {
        name: 'carCreate'
      }
    ),
  )(Form)