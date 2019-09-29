import Icon from 'modules/common/components/Icon';
import ProgressBar from 'modules/common/components/ProgressBar';
import { colors } from 'modules/common/styles';
import * as React from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';

const Wrapper = styled.div`
  width: 315px;
`;

const Title = styled.h2`
  margin: 0 0 20px;
  font-size: 16px;
`;

const Checklist = styled.ul`
  padding: 0;
  list-style: none;
  margin: 0;
`;

const ChecklistItem = styledTS<{ isComplete?: boolean }>(styled.li)`
	text-decoration: ${props => props.isComplete && 'line-through'};
	font-style: ${props => props.isComplete && 'italic'};
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
      props.isComplete ? colors.colorCoreGreen : colors.textPrimary};
		background: ${props => props.isComplete && colors.colorCoreGreen};
		display: block;
		position: absolute;
		left: 0;
		text-align: center;
		color: ${colors.colorWhite};
	}

	&:last-child {
		margin: 0;
	}

	a {
		color: ${props =>
      props.isComplete ? colors.colorCoreGray : colors.textPrimary};
	}
`;

const Back = styled.div`
  margin-bottom: 10px;
  border-radius: 20px;
  display: inline-block;
  text-align: center;
  width: 28px;
  height: 28px;
  margin-left: -7px;

  &:hover {
    background: ${colors.bgActive};
  }

  i {
    line-height: 26px;
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
  icon?: string;
};

type State = {
  show: boolean;
};

class ModulDetail extends React.PureComponent<Props, State> {
  render() {
    return (
      <Wrapper>
        <Back>
          <Icon icon="arrow-left" size={24} />
        </Back>

        <Title>Team inbox</Title>

        <Carousel>
          <Carousel.Item>
            <img
              width="100%"
              src="https://erxes.io/static/images/screens/inbox.jpg"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              width="100%"
              src="https://erxes.io/static/images/screens/inbox.jpg"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              width="100%"
              src="https://erxes.io/static/images/screens/inbox.jpg"
            />
          </Carousel.Item>
        </Carousel>

        <p>
          Shared inbox for teams. Combine real-time client and team
          communication with in-app messaging, live chat, email and form, so
          your customers can reach you however and whenever they want.
        </p>

        <Progress>
          <ProgressBar
            percentage={20}
            color={colors.colorCoreBlue}
            height="18px"
          />
          <span>20%</span>
        </Progress>

        <Checklist>
          <ChecklistItem isComplete={true}>
            <Link to="/deal">Complete profile</Link>
          </ChecklistItem>
          <ChecklistItem>
            <Link to="/inbox">Create Channel</Link>
          </ChecklistItem>
          <ChecklistItem>
            <Link to="/inbox">Create Brand</Link>
          </ChecklistItem>
          <ChecklistItem>
            <Link to="/inbox">Invite team members</Link>
          </ChecklistItem>
          <ChecklistItem>
            <Link to="/inbox">Connect integrations</Link>
          </ChecklistItem>
        </Checklist>
      </Wrapper>
    );
  }
}

export default ModulDetail;
