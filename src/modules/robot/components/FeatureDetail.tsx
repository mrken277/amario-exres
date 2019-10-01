import ProgressBar from 'modules/common/components/ProgressBar';
import colors from 'modules/common/styles/colors';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';
import { IFeature } from '../types';
import { getAppearance } from '../utils';
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

const Progress = styled.div`
  display: flex;
  margin: 30px 0 10px;

  span {
    margin-left: 10px;
  }
`;

type Props = {
  feature: IFeature;
  completeShowStep: () => void;
  stepsCompleteness: { [key: string]: boolean };
};

class FeatureDetail extends React.Component<Props> {
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

        <p>{getAppearance(feature.name).description}</p>

        <Progress>
          <ProgressBar
            percentage={20}
            color={colors.colorCoreBlue}
            height="18px"
          />
          <span>20%</span>
        </Progress>

        {this.renderSettings()}
      </Wrapper>
    );
  }
}

export default FeatureDetail;
