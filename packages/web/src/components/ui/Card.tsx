import React from 'react';
import styled from 'styled-components';
import { Card as MUICard } from '@material-ui/core';
import { CardContent } from '@material-ui/core';
import { flexbox, space, layout, color, justifyContent, FlexProps } from 'styled-system';

const CardStyled = styled(MUICard)`
  ${flexbox}
  ${space}
  ${layout}
  ${color}
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
  border-bottom: 1px solid #e5e7eb;
  border-radius: .375rem;
`;

type CardType = {
  children: React.ReactNode;
} & FlexProps;

export function Card(props: CardType) {
  const { children, ...rest } = props;
  return (
    <CardStyled {...rest} elevation={0} style={{ display: 'flex' }}>
      {children}
    </CardStyled>
  );
}
