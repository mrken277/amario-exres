import React from 'react';

type Props = {
  items: any[];
  sendToBoard: (item: any) => void;
  remove: (item: any) => void;
};

class ArchivedItems extends React.Component<Props> {
  renderItem(item: any) {
    return (
      <li key={item._id}>
        <div>{item.name}</div>
        <span onClick={this.props.sendToBoard.bind(this, item)}>
          Send to Board
        </span>{' '}
        - <span onClick={this.props.remove.bind(this, item)}>Delete</span>
      </li>
    );
  }

  render() {
    return <ul>{this.props.items.map(item => this.renderItem(item))}</ul>;
  }
}

export default ArchivedItems;
