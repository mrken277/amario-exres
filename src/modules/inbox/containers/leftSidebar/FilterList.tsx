import client from 'apolloClient';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import FilterByParams from 'modules/common/components/FilterByParams';
import Spinner from 'modules/common/components/Spinner';
import { Alert, withProps } from 'modules/common/utils';
import { queries } from 'modules/inbox/graphql';
import { NoHeight } from 'modules/inbox/styles';
import { generateParams } from 'modules/inbox/utils';
import { queries as ChannelQueries } from 'modules/settings/channels/graphql';
import { ChannelsCountQueryResponse } from 'modules/settings/channels/types';
import React from 'react';
import { graphql } from 'react-apollo';

type Props = {
  query?: { queryName: string; dataName: string; variables?: any };
  fields?: any[];
  counts: string;
  paramKey: string;
  icon?: string;
  queryParams?: any;
  refetchRequired: string;
  channelsCountQuery?: ChannelsCountQueryResponse;
};

type State = {
  fields: any[];
  counts: any;
  loading: boolean;
  page: number;
};

class FilterList extends React.PureComponent<Props, State> {
  mounted: boolean;

  constructor(props: Props) {
    super(props);

    let loading = true;

    if (props.fields) {
      loading = false;
    }

    this.mounted = false;

    this.state = {
      fields: props.fields || [],
      counts: {},
      loading,
      page: 1
    };
  }

  fetchData(ignoreCache = false) {
    const { query, counts, queryParams } = this.props;

    this.mounted = true;

    // Fetching filter lists channels, brands, tags etc
    if (query) {
      const { queryName, dataName, variables = {} } = query;
      const { page } = this.state;

      client
        .query({
          query: gql(queries[queryName]),
          variables:
            dataName === 'channels'
              ? { ...variables, page, perPage: 10 }
              : variables
        })
        .then(({ data }: any) => {
          if (this.mounted) {
            this.setState({
              fields:
                dataName === 'channels'
                  ? [...this.state.fields, ...data[dataName]]
                  : data[dataName],
              page: page + 1
            });
          }
        })
        .catch(e => {
          Alert.error(e.message);
        });
    }

    // Fetching count query
    client
      .query({
        query: gql(queries.conversationCounts),
        variables: { ...generateParams({ ...queryParams }), only: counts },
        fetchPolicy: ignoreCache ? 'network-only' : 'cache-first'
      })
      .then(({ data, loading }: { data: any; loading: boolean }) => {
        if (this.mounted) {
          this.setState({ counts: data.conversationCounts[counts], loading });
        }
      })
      .catch(e => {
        Alert.error(e.message);
      });
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  loadMoreChannels(totalCount: number) {
    const handle = setInterval(() => {
      const { fields } = this.state;

      if (totalCount === 0) {
        clearInterval(handle);
      }

      if (fields.length < totalCount) {
        this.fetchData(true);
      } else {
        clearInterval(handle);
      }
    }, 1000);
  }

  componentDidUpdate(prevProps) {
    const { queryParams, refetchRequired } = this.props;

    if (prevProps.refetchRequired !== refetchRequired) {
      return this.fetchData(true);
    }

    if (prevProps.queryParams === queryParams) {
      return;
    }

    return this.fetchData(true);
  }

  render() {
    const { paramKey, icon, channelsCountQuery } = this.props;
    const { counts, fields, loading, page } = this.state;

    if (loading) {
      return <Spinner objective={true} />;
    }

    if (channelsCountQuery && !channelsCountQuery.loading && page === 2) {
      this.loadMoreChannels(channelsCountQuery.channelsTotalCount || 0);
    }

    return (
      <NoHeight>
        <FilterByParams
          fields={fields}
          paramKey={paramKey}
          counts={counts}
          icon={icon}
          loading={false}
          searchable={false}
        />
      </NoHeight>
    );
  }
}

export default withProps<Props>(
  compose(
    graphql<Props, ChannelsCountQueryResponse>(
      gql(ChannelQueries.channelsCount),
      {
        name: 'channelsCountQuery',
        skip: ({ query }) => !query || query.dataName !== 'channels'
      }
    )
  )(FilterList)
);
