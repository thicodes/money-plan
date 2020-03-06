import React from 'react';
import styled from 'styled-components';
import { space } from 'styled-system';

const ContentStyled = styled.div`
  flex: 1;
  display: grid;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  grid-gap: 15px 10px;
  ${space}
`;

export const Content = ({ children, ...rest }) => {
  return <ContentStyled {...rest}>{children}</ContentStyled>;
};
