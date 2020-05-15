import React, { FunctionComponent, ReactNode } from 'react';
import styled, { StyledComponentBase } from 'styled-components';

import fonts from '../../constants/fonts';
import colors from '../../constants/colors';
import timings from '../../constants/timings';

export const CardContainer = styled.div`
  ${({ elevation }: { elevation: number }) => `
    display: inline-flex;
    flex-flow: column nowrap;
    width: fit-content;
    ${fonts.body}

    font-size: 1rem;

    border-radius: 0.25rem;
    margin: .25rem;

    ${!elevation ? `border: 1px solid ${colors.grayXlight};`: ''};

    transition: box-shadow ${timings.slow};
    box-shadow: 0rem ${elevation * .25}rem ${elevation * .75}rem ${elevation * -.25}rem rgba(0,0,0,${.6 - elevation * .1});
    background-color: ${colors.background};
  `}
`;

export const Header = styled.div`
  padding: 1.5rem 1.5rem 0rem;
  border-radius: 0.25rem .25rem 0rem 0rem;
  font-weight: bold;
  text-transform: uppercase;
  color: ${colors.grayDark};
`;

export const NoPaddingHeader = styled(Header)`
  padding: 0rem;
  overflow: hidden;
`;

export const Body = styled.div`
  padding: 1.5rem 1.5rem;
  color: ${colors.grayMedium};
`;

export const Footer = styled.div`
  padding: 1rem 1.5rem;
  display: flex;
  flex-flow: row wrap;

  justify-content: flex-end;
  text-align: right;

  color: ${colors.grayLight};

  border-top: 1px solid ${colors.grayXlight};
  border-radius: 0rem 0rem .25rem .25rem;
`;

export interface CardProps {
  StyledContainer?: String & StyledComponentBase<any, {}>,
  StyledHeader?: String & StyledComponentBase<any, {}>,
  StyledBody?: String & StyledComponentBase<any, {}>,
  StyledFooter?: String & StyledComponentBase<any, {}>,

  header?: ReactNode,
  children?: ReactNode,
  footer?: ReactNode,

  elevation?: Number
}

const Card = ({
  StyledContainer = CardContainer,
  StyledHeader = Header,
  StyledBody = Body,
  StyledFooter = Footer,

  header,
  children,
  footer,

  elevation = 1
}: CardProps) => (
  <StyledContainer elevation={elevation}>
    {header && <StyledHeader>{header}</StyledHeader>}
    {children && <StyledBody>{children}</StyledBody>}
    {footer && <StyledFooter>{footer}</StyledFooter>}
  </StyledContainer>
);

export default Card;
