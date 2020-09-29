import { Col, Row } from 'antd';
import { IDashboardItem } from 'modules/dashboard/types';
import React from 'react';
import styled from 'styled-components';
import ChartRenderer from '../ChartRenderer';
import PdfDataItem from './PdfDataItem';

type Props = {
  items: IDashboardItem[];
  dashboardId: string;
};

const Datas = styled.div`
  padding: 20px;
  background: #fff;
`;

class PdfData extends React.Component<Props, {}> {
  render() {
    const { items } = this.props;

    return (
      <Datas>
        <Row gutter={[20, 20]}>
          {items.map((item, index) => (
            <Col key={Math.random()} span={24}>
              <PdfDataItem
                key={Math.random()}
                title={item.name}
                bordered={true}
              >
                <ChartRenderer
                  key={Math.random()}
                  vizState={JSON.parse(item.vizState)}
                  chartHeight={500}
                />
              </PdfDataItem>
            </Col>
          ))}
        </Row>
      </Datas>
    );
  }
}

export default PdfData;
