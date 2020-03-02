import React from 'react';
import styled from 'styled-components';
import { Button as MUIButton } from '@material-ui/core';
import { flexbox, space, layout, color, justifyContent, FlexProps } from 'styled-system';

export const Button = styled(MUIButton)(flexbox, space, layout, color);
