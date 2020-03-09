import { graphql } from 'react-relay';
import { SelectorStoreUpdater, ROOT_ID } from 'relay-runtime';

import { connectionUpdater } from '../../relay/mutationUtils';

export const TransactionCreateMutation = graphql`
  mutation TransactionCreateMutation($input: TransactionCreateInput!) {
    TransactionCreate(input: $input) {
      error
      transactionEdge {
        node {
          id
          date
          isExpense
        }
      }
    }
  }
`;

export const updater: SelectorStoreUpdater = store => {
  const newEdge = store.getRootField('TransactionCreate').getLinkedRecord('transactionEdge');

  connectionUpdater({
    store,
    parentId: ROOT_ID,
    connectionName: 'Transactions_transactions',
    edge: newEdge,
    before: true,
  });
};
