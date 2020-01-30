import { FilterBtn, RemoveFilter } from 'modules/boards/styles/rightMenu';
import Button from 'modules/common/components/Button';
import DropdownToggle from 'modules/common/components/DropdownToggle';
import EmptyState from 'modules/common/components/EmptyState';
import Icon from 'modules/common/components/Icon';
import Tip from 'modules/common/components/Tip';
import { __ } from 'modules/common/utils';
import Participators from 'modules/inbox/components/conversationDetail/workarea/Participators';
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import PipelineWatch from '../containers/PipelineWatch';
import {
  HeaderButton,
  HeaderItems,
  HeaderLabel,
  HeaderLink,
  PageHeader
} from '../styles/header';
import { IBoard, IPipeline } from '../types';
import RightMenu from './RightMenu';

type Props = {
  onSearch: (search: string) => void;
  onSelect: (values: string[] | string, name: string) => void;
  onClear: (name: string, values) => void;
  isFiltered: () => boolean;
  clearFilter: () => void;
  currentBoard?: IBoard;
  currentPipeline?: IPipeline;
  boards: IBoard[];
  middleContent?: () => React.ReactNode;
  history: any;
  queryParams: any;
  type: string;
  extraFilter?: React.ReactNode;
  link: string;
  rightContent?: () => React.ReactNode;
  boardText?: string;
  pipelineText?: string;
};

type State = {
  show: boolean;
  target: any;
};

class MainActionBar extends React.Component<Props, State> {
  static defaultProps = {
    viewType: 'board',
    boardText: 'Board',
    pipelineText: 'Pipeline'
  };

  constructor(props) {
    super(props);

    this.state = {
      show: false,
      target: null
    };
  }

  showFilter = ({ target }) => {
    this.setState(s => ({ target, show: !s.show }));
  };

  hideFilter = () => {
    this.setState({ show: false });
  };

  renderBoards() {
    const { currentBoard, boards } = this.props;

    if ((currentBoard && boards.length === 1) || boards.length === 0) {
      return (
        <EmptyState icon="web-grid-alt" text="No other boards" size="small" />
      );
    }

    return boards.map(board => {
      if (currentBoard && board._id === currentBoard._id) {
        return null;
      }

      let link = `${this.props.link}?id=${board._id}`;

      const { pipelines = [] } = board;

      if (pipelines.length > 0) {
        link = `${link}&pipelineId=${pipelines[0]._id}`;
      }

      return (
        <li key={board._id}>
          <Link to={link}>{board.name}</Link>
        </li>
      );
    });
  }

  renderPipelines() {
    const { currentBoard, currentPipeline, link } = this.props;

    const pipelines = currentBoard ? currentBoard.pipelines || [] : [];

    if ((currentPipeline && pipelines.length === 1) || pipelines.length === 0) {
      return (
        <EmptyState
          icon="web-section-alt"
          text="No other pipeline"
          size="small"
        />
      );
    }

    if (!currentBoard) {
      return null;
    }

    return pipelines.map(pipeline => {
      if (currentPipeline && pipeline._id === currentPipeline._id) {
        return null;
      }

      return (
        <li key={pipeline._id}>
          <Link
            to={`${link}?id=${currentBoard._id}&pipelineId=${pipeline._id}`}
          >
            {pipeline.name}
          </Link>
        </li>
      );
    });
  }

  renderFilter() {
    const hasFilter = this.props.isFiltered();
    const {
      onSearch,
      onSelect,
      onClear,
      queryParams,
      link,
      extraFilter
    } = this.props;

    const rightMenuProps = {
      onHide: this.hideFilter,
      show: this.state.show,
      onSearch,
      onSelect,
      onClear,
      queryParams,
      link,
      extraFilter
    };

    return (
      <HeaderLink>
        <Tip text={__('Menu')} placement="bottom">
          <FilterBtn active={hasFilter}>
            <Button
              btnStyle={hasFilter ? 'success' : 'link'}
              className={hasFilter ? 'filter-success' : 'filter-link'}
              icon="menu-2"
              onClick={this.showFilter}
            >
              {hasFilter && __('Filtering is on')}
            </Button>
            {hasFilter && (
              <RemoveFilter>
                <Button
                  btnStyle="link"
                  icon="cancel-1"
                  onClick={this.props.clearFilter}
                />
              </RemoveFilter>
            )}
          </FilterBtn>
        </Tip>
        <RightMenu {...rightMenuProps} />
      </HeaderLink>
    );
  }

  renderVisibility() {
    const { currentPipeline } = this.props;

    if (!currentPipeline) {
      return null;
    }

    if (currentPipeline.visibility === 'public') {
      return (
        <HeaderButton>
          <Icon icon="earthgrid" /> {__('Public')}
        </HeaderButton>
      );
    }

    const members = currentPipeline.members || [];

    return (
      <>
        <HeaderButton>
          <Icon icon="users-alt" /> {__('Private')}
        </HeaderButton>
        <Participators participatedUsers={members} limit={3} />
      </>
    );
  }

  render() {
    const {
      currentBoard,
      currentPipeline,
      middleContent,
      type,
      rightContent,
      boardText,
      pipelineText
    } = this.props;

    const actionBarLeft = (
      <HeaderItems>
        <HeaderLabel>
          <Icon icon="web-grid-alt" /> {__(boardText || '')}:{' '}
        </HeaderLabel>
        <Dropdown>
          <Dropdown.Toggle as={DropdownToggle} id="dropdown-board">
            <HeaderButton rightIconed={true}>
              {(currentBoard && currentBoard.name) || __('Choose board')}
              <Icon icon="angle-down" />
            </HeaderButton>
          </Dropdown.Toggle>
          <Dropdown.Menu>{this.renderBoards()}</Dropdown.Menu>
        </Dropdown>
        <HeaderLabel>
          <Icon icon="web-section-alt" /> {__(pipelineText || '')}:{' '}
        </HeaderLabel>
        <Dropdown>
          <Dropdown.Toggle as={DropdownToggle} id="dropdown-pipeline">
            <HeaderButton rightIconed={true}>
              {(currentPipeline && currentPipeline.name) ||
                __('Choose pipeline')}
              <Icon icon="angle-down" />
            </HeaderButton>
          </Dropdown.Toggle>
          <Dropdown.Menu>{this.renderPipelines()}</Dropdown.Menu>
        </Dropdown>
        <HeaderLink>
          <Tip text={__('Manage Board & Pipeline')} placement="bottom">
            <Link
              to={`/settings/boards/${type}?boardId=${
                currentBoard ? currentBoard._id : ''
              }`}
            >
              <Icon icon="bright" />
            </Link>
          </Tip>
        </HeaderLink>

        {currentPipeline ? (
          <PipelineWatch pipeline={currentPipeline} type={type} />
        ) : null}

        {this.renderVisibility()}
      </HeaderItems>
    );

    const actionBarRight = (
      <HeaderItems>
        {middleContent && middleContent()}

        {rightContent && rightContent()}

        {this.renderFilter()}
      </HeaderItems>
    );

    return (
      <PageHeader>
        {actionBarLeft}
        {actionBarRight}
      </PageHeader>
    );
  }
}

export default MainActionBar;
