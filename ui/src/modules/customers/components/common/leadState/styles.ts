import { dimensions } from 'modules/common/styles';
import colors from 'modules/common/styles/colors';
import styled, { css } from 'styled-components';
import styledTS from 'styled-components-ts';

export const LeadStateWrapper = styled.div`
	display: flex;
	padding: 0 ${dimensions.coreSpacing}px;
	margin-bottom: ${dimensions.unitSpacing}px;
`;

export const StateItem =  styledTS<{ active?: boolean; past?: boolean }>(styled.div)`
	flex: 1;
	padding: 5px ${dimensions.coreSpacing}px;
	line-height: ${dimensions.coreSpacing}px;
	position: relative;
	color: ${props => props.active ? colors.colorWhite :colors.textSecondary};
	background: ${props => props.active ? colors.colorCoreBlue :colors.bgGray};
	border-right: none;
	margin-right: ${dimensions.unitSpacing}px;
	margin-left: 5px;
	font-weight: 500;
	height: 32px;
	transition: opacity 0.3s ease;

	&:hover {
		opacity: 0.85;
		cursor: pointer;
	}

	&:first-child {
		border-top-left-radius: 17px;
		border-bottom-left-radius: 17px;
		margin-left: 0;

		&:after, &:before {
			left: ${dimensions.coreSpacing}px;
		}
	}

	&:last-child {
		border-top-right-radius: 17px;
		border-bottom-right-radius: 17px;
		margin-right: 0;

		&:after, &:before {
			right: ${dimensions.coreSpacing}px;
		}
	}

	&:after, &:before {
		content: '';
		position: absolute;
		height: 50%;
		left: 0;
		right: -5px;
		left: -5px;
	}
	
	&:after {
		background: ${colors.bgGray};
		transform: skew(-30deg) translate3d(0, 0, 0);
		bottom: 0;
	}

	&:before {
		background: ${colors.bgGray};
		transform: skew(28deg) translate3d(0, 0, 0);
		top: 0;
	}

	${props => props.active && css`
		color: ${colors.colorWhite};
		background: ${colors.colorCoreBlue};

		&:after {
			background: ${colors.colorCoreBlue};
		}

		&:before {
			background: ${colors.colorCoreBlue};
		}
	`};

	${props => props.past && css`
		color: ${colors.colorWhite};
		background: ${colors.colorCoreGreen};

		&:after {
			background: ${colors.colorCoreGreen};
		}

		&:before {
			background: ${colors.colorCoreGreen};
		}
	`};

	> div {
		z-index: 2;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;

		i {
			margin-right: 5px;
		}
	}

	span {
		opacity: 0.8;
		font-weight: normal;
		font-size: 90%;
		margin-left: 5px;
	}
`;
