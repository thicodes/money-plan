import React from 'react';
import styled from 'styled-components';
import { CardActions as MUICardActions } from '@material-ui/core';
import { CardContent } from '@material-ui/core';
import { flexbox, space, layout, color, justifyContent, FlexProps } from 'styled-system';

export const CardActions = styled(MUICardActions)(flexbox, space, layout, color);

type CardType = {
  children: React.ReactNode;
} & FlexProps;
