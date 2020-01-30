import Button from 'modules/common/components/Button';
import { FormControl } from 'modules/common/components/form';
import Tip from 'modules/common/components/Tip';
import { IOption } from 'modules/common/types';
import { __ } from 'modules/common/utils';
import SelectTeamMembers from 'modules/settings/team/containers/SelectTeamMembers';
import React from 'react';
import Select from 'react-select-plus';
import { PRIORITIES } from '../constants';
import {
  ClearDate,
  DateFilter,
  FilterBox,
  FilterDetail,
  FilterItem,
  Header,
  RightMenuContainer
} from '../styles/rightMenu';
import SelectLabel from './label/SelectLabel';

type Props = {
  onSearch: (search: string) => void;
  onSelect: (values: string[] | string, name: string) => void;
  onClear: (name: string, values) => void;
  queryParams: any;
  link: string;
  show: boolean;
  extraFilter?: React.ReactNode;
};

const teamMemberCustomOption = {
  value: '',
  label: 'Assigned to no one'
};

export default class RightMenu extends React.Component<Props> {
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

  showArchive = () => {};

  render() {
    const { queryParams, onSelect, extraFilter, show } = this.props;

    const priorityValues = PRIORITIES.map(p => ({ label: p, value: p }));
    const priorities = queryParams ? queryParams.priority : [];

    const onPrioritySelect = (ops: IOption[]) =>
      onSelect(ops.map(option => option.value), 'priority');

    return (
      <RightMenuContainer show={show}>
        <span onClick={this.showArchive}>Archived items</span>
        <Header>{__('Filter')}</Header>
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
      </RightMenuContainer>
    );
  }
}
