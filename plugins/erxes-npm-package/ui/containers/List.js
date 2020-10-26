import * as compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import React from 'react';
import '../style.css';

const List = (props) => {
    return (
      <>
        <h1>List</h1>

        <h3>
          <a href="/my-plugin/form">Create new</a>
        </h3>
        
        <table className="my-plugin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>

          <tbody>
            {(props.myPluginQuery.myPluginList || []).map((row) => {
              return (
                <tr>
                  <td>{row.name}</td>
                  <td>{row.description}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </>
    )
}

export default compose(
    graphql(
      gql(`
        query myPluginList {
            myPluginList {
                name
                description
            }
        }
      `),
      {
        name: 'myPluginQuery'
      }
    ),
  )(List)