import gql from 'graphql-tag';
import { queries } from 'modules/activityLogs/graphql';
import { withProps } from 'modules/common/utils';
import { InternalNoteDetailQueryResponse } from 'modules/internalNotes/types';
import React from 'react';
import { compose, graphql } from 'react-apollo';

type Props = {
  noteId: string;
};

type FinalProps = {
  internalNoteDetailQuery: InternalNoteDetailQueryResponse;
} & Props;

class FormContainer extends React.Component<FinalProps> {
  render() {
    console.log('sjdkajdkljskldj');
    const { internalNoteDetailQuery } = this.props;

    const internalNote = internalNoteDetailQuery.internalNoteDetail;

    console.log(internalNote);

    return <div>djsakdjklsjdkl</div>;
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
