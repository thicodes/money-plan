import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull, GraphQLList } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../core/connection/CustomConnectionType';
import { registerType, nodeInterface } from '../../interface/NodeInterface';

import TagType from '../tag/TagType';

const TransactionType = registerType(
  new GraphQLObjectType({
    name: 'Transaction',
    description: 'Transaction data',
    fields: () => ({
      id: globalIdField('Transaction'),
      _id: {
        type: GraphQLString,
        resolve: transaction => transaction._id,
      },
      name: {
        type: GraphQLString,
        resolve: transaction => transaction.name,
      },
      kind: {
        type: GraphQLString,
        resolve: transaction => transaction.kind,
      },
      tags: {
        type: new GraphQLList(TagType),
        resolve: transaction => transaction.tags,
      },
    }),
    interfaces: () => [nodeInterface],
  }),
);

export default TransactionType;

export const TransactionConnection = connectionDefinitions({
  name: 'Transaction',
  nodeType: GraphQLNonNull(TransactionType),
});
