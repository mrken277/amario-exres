import * as compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import React from 'react';

var Filter = require('bad-words'),
    filter = new Filter();

const App = (props) => {
    console.log(filter.clean("Don't be an ash0le"), props.myPluginQuery.myPluginQ1);

    return (
        <div>
            My plugin
        </div>
    )
}

export default compose(
    graphql(
      gql(`
        query myPluginQ1 {
            myPluginQ1 {
                name
            }
        }
      `),
      {
        name: 'myPluginQuery'
      }
    ),
  )(App)