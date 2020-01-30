import Button from 'modules/common/components/Button';
import { FormControl } from 'modules/common/components/form';
import { Tabs, TabTitle } from 'modules/common/components/tabs';
import Tip from 'modules/common/components/Tip';
import { IOption } from 'modules/common/types';
import { __ } from 'modules/common/utils';
import SelectTeamMembers from 'modules/settings/team/containers/SelectTeamMembers';
import React from 'react';
import Select from 'react-select-plus';
import { PRIORITIES } from '../constants';
import ArchivedItems from '../containers/ArchivedItems';
import {
  ClearDate,
  DateFilter,
  FilterBox,
  FilterDetail,
  FilterItem,
  RightMenuContainer,
  TabContent
} from '../styles/rightMenu';
import { IOptions } from '../types';
import SelectLabel from './label/SelectLabel';

type Props = {
  onSearch: (search: string) => void;
  onSelect: (values: string[] | string, name: string) => void;
  onClear: (name: string, values) => void;
  queryParams: any;
  link: string;
  show: boolean;
  extraFilter?: React.ReactNode;
  options: IOptions;
};

const teamMemberCustomOption = {
  value: '',
  label: 'Assigned to no one'
};

type State = {
  currentTab: string;
  search: string;
  type: string;
};

export default class RightMenu extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 'Filter',
      search: '',
      type: 'item'
    };
  }

  onSearch = (e: React.KeyboardEvent<Element>) => {
    if (e.key === 'Enter') {
      const target = e.currentTarget as HTMLInputElement;
      this.props.onSearch(target.value || '');
    }
  };

  renderDates() {
    const { queryParams, link } = this.props;

    if (link.includes('calendar')) {
      return null;
    }

    const { onSelect, onClear } = this.props;

    const renderLink = (label: string, name: string) => {
      const selected = queryParams.closeDateType === name;

      return (
        <FilterItem>
          <FilterDetail
            selected={selected}
            onClick={onSelect.bind(this, name, 'closeDateType')}
          >
            {__(label)}
          </FilterDetail>
          <ClearDate selected={selected}>
            <Tip text={__('Remove this filter')}>
              <Button
                btnStyle="link"
                icon="cancel-1"
                onClick={onClear.bind(this, 'closeDateType')}
              />
            </Tip>
          </ClearDate>
        </FilterItem>
      );
    };

    return (
      <DateFilter>
        {renderLink('Due to the next day', 'nextDay')}
        {renderLink('Due in the next week', 'nextWeek')}
        {renderLink('Due in the next month', 'nextMonth')}
        {renderLink('Has no close date', 'noCloseDate')}
        {renderLink('Overdue', 'overdue')}
      </DateFilter>
    );
  }

  onChange = (name: string, value: string) => {
    this.setState({ [name]: value } as Pick<State, keyof State>);
  };

  renderFilter() {
    const { queryParams, onSelect, extraFilter } = this.props;

    const priorityValues = PRIORITIES.map(p => ({ label: p, value: p }));
    const priorities = queryParams ? queryParams.priority : [];

    const onPrioritySelect = (ops: IOption[]) =>
      onSelect(ops.map(option => option.value), 'priority');

    return (
      <FilterBox>
        <FormControl
          defaultValue={queryParams.search}
          placeholder={__('Search ...')}
          onKeyPress={this.onSearch}
          autoFocus={true}
        />
        {extraFilter}
        <Select
          placeholder="Choose a priority"
          value={priorities}
          options={priorityValues}
          name="priority"
          onChange={onPrioritySelect}
          multi={true}
          loadingPlaceholder={__('Loading...')}
        />
        <SelectTeamMembers
          label="Choose team members"
          name="assignedUserIds"
          queryParams={queryParams}
          onSelect={onSelect}
          customOption={teamMemberCustomOption}
        />
        <SelectLabel
          queryParams={queryParams}
          name="labelIds"
          onSelect={onSelect}
          filterParams={{ pipelineId: queryParams.pipelineId }}
          multi={true}
          customOption={{ value: '', label: 'No label chosen' }}
        />

        {this.renderDates()}
      </FilterBox>
    );
  }

  renderArchivedItems() {
    const { type, search } = this.state;
    const { options, queryParams } = this.props;

    const onChangeSearch = e => this.onChange('search', e.target.value);

    return (
      <div>
        <input type="text" value={search} onChange={onChangeSearch} />
        {type === 'list' ? (
          <span onClick={this.onChange.bind(this, 'type', 'item')}>
            Switch To Items
          </span>
        ) : (
          <span onClick={this.onChange.bind(this, 'type', 'list')}>
            Switch To Lists
          </span>
        )}
        <ArchivedItems
          options={options}
          pipelineId={queryParams.pipelineId}
          search={search}
          type={type}
        />
      </div>
    );
  }

  renderTabContent() {
    if (this.state.currentTab === 'Filter') {
      return this.renderFilter();
    }

    return this.renderArchivedItems();
  }

  render() {
    const recentOnClick = () => {
      this.onChange('currentTab', 'Filter');
    };

    const unreadOnClick = () => {
      this.onChange('currentTab', 'Archived items');
    };

    const { currentTab } = this.state;

    return (
      <RightMenuContainer show={this.props.show}>
        <Tabs full={true}>
          <TabTitle
            className={currentTab === 'Filter' ? 'active' : ''}
            onClick={recentOnClick}
          >
            {__('Filter')}
          </TabTitle>
          <TabTitle
            className={currentTab === 'Archived items' ? 'active' : ''}
            onClick={unreadOnClick}
          >
            {__('Archived items')}
          </TabTitle>
        </Tabs>
        <TabContent>{this.renderTabContent()}</TabContent>
      </RightMenuContainer>
    );
  }
}
