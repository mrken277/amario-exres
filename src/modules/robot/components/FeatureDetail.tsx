import colors from 'modules/common/styles/colors';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';
import { IFeature } from '../types';
import { Title } from './styles';

const Wrapper = styled.div`
  width: 315px;
`;

const Checklist = styled.ul`
  padding: 0;
  list-style: none;
  margin: 0;
`;

const ChecklistItem = styledTS<{ isComplete?: boolean }>(styled.li)`
	
	position: relative;
	padding-left: 30px;
	margin-bottom: 10px;

	&:before {
		content: '\\ea3f';
		font-style: normal;
    font-family: 'erxes';
		width: 20px;
		height: 20px;
		border-radius: 10px;
		border: 1px solid;
		border-color: ${props =>
      props.isComplete ? colors.colorCoreGreen : colors.colorCoreGray};
		background: ${props => props.isComplete && colors.colorCoreGreen};
		display: block;
		position: absolute;
		left: 0;
		text-align: center;
		color: ${colors.colorWhite};
	}

	a {
    text-decoration: ${props => props.isComplete && 'line-through'};
	  font-style: ${props => props.isComplete && 'italic'};
		color: ${props =>
      props.isComplete ? colors.colorCoreGray : colors.textPrimary};

      &:hover {
        text-decoration: underline;
      }
	}
`;

class FeatureDetail extends React.Component<{
  feature: IFeature;
  completeShowStep: () => void;
  stepsCompleteness: { [key: string]: boolean };
}> {
  renderSettings() {
    const { feature, stepsCompleteness } = this.props;

    if (!feature.showSettings) {
      return null;
    }

    return (
      <>
        <Checklist>
          {feature.settings.map((setting, index) => {
            const detail = feature.settingsDetails[setting];

            return (
              <ChecklistItem
                key={index}
                isComplete={stepsCompleteness[setting]}
              >
                <Link to={detail.url}>{detail.name}</Link>
                {stepsCompleteness[setting] && (
                  <span role="img" aria-label="Wave">
                    {' '}
                    👋
                  </span>
                )}
              </ChecklistItem>
            );
          })}
        </Checklist>
      </>
    );
  }

  onVideoClick = () => {
    // tslint:disable
    console.log('on video click');

    this.props.completeShowStep();
  };

  render() {
    const { feature } = this.props;

    return (
      <Wrapper>
        <Title>{feature.name}</Title>

        {this.renderSettings()}
      </Wrapper>
    );
  }
}

export default FeatureDetail;
