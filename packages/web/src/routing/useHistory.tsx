import RoutingContext from './RoutingContext';
import React from 'react';

const { useCallback, useContext } = React;

export const useHistory = () => {
  return useContext(RoutingContext).history;
};
