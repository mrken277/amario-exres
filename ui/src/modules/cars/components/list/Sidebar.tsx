import CategoryList from 'modules/cars/containers/carCategory/CategoryList';
import Wrapper from 'modules/layout/components/Wrapper';
import React from 'react';
import BrandFilter from '../../containers/filters/BrandFilter';
import SegmentFilter from '../../containers/filters/SegmentFilter';
import TagFilter from '../../containers/filters/TagFilter';

function Sidebar({
  loadingMainQuery,
  history,
  queryParams
}: {
  loadingMainQuery: boolean;
  history: any;
  queryParams: any;
}) {
  return (
    <Wrapper.Sidebar>
      <CategoryList queryParams={queryParams} history={history} />
      <SegmentFilter loadingMainQuery={loadingMainQuery} />
      <TagFilter loadingMainQuery={loadingMainQuery} />
      <BrandFilter loadingMainQuery={loadingMainQuery} />
    </Wrapper.Sidebar>
  );
}

export default Sidebar;
