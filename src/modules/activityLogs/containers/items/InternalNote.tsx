import gql from 'graphql-tag';
import InternalNote from 'modules/activityLogs/components/items/InternalNote';
import { queries } from 'modules/activityLogs/graphql';
import Spinner from 'modules/common/components/Spinner';
import { withProps } from 'modules/common/utils';
import { InternalNoteDetailQueryResponse } from 'modules/internalNotes/types';
import React from 'react';
import { compose, graphql } from 'react-apollo';

type Props = {
  activity: any;
  noteId: string;
};

type FinalProps = {
  internalNoteDetailQuery: InternalNoteDetailQueryResponse;
} & Props;

class FormContainer extends React.Component<FinalProps> {
  render() {
    const { internalNoteDetailQuery } = this.props;

    if (internalNoteDetailQuery.loading) {
      return <Spinner />;
    }

    const internalNote = internalNoteDetailQuery.internalNoteDetail;

    const updatedProps = {
      ...this.props,
      internalNote
    };

    return <InternalNote {...updatedProps} />;
  }
}

export default withProps<Props>(
  compose(
    graphql<Props, InternalNoteDetailQueryResponse>(
      gql(queries.internalNoteDetail),
      {
        name: 'internalNoteDetailQuery',
        options: ({ noteId }) => ({
          variables: {
            _id: noteId
          }
        })
      }
    )
  )(FormContainer)
);
