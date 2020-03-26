import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';

const SpinnerStyled = styled.div`
  margin: auto;
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export const Spinner = () => (
  <SpinnerStyled>
    <CircularProgress />
  </SpinnerStyled>
);
