import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../core/connection/CustomConnectionType';
import { registerType, nodeInterface } from '../../interface/NodeInterface';

const AccountType = registerType(
  new GraphQLObjectType({
    name: 'Account',
    description: 'Account data',
    fields: () => ({
      id: globalIdField('Account'),
      _id: {
        type: GraphQLString,
        resolve: account => account._id,
      },
      name: {
        type: GraphQLString,
        resolve: account => account.name,
      },
      bank: {
        type: GraphQLString,
        resolve: account => account.bank,
      },
      kind: {
        type: GraphQLBoolean,
        resolve: account => account.kind,
      },
    }),
    interfaces: () => [nodeInterface],
  }),
);

export default AccountType;

export const AccountConnection = connectionDefinitions({
  name: 'Account',
  nodeType: GraphQLNonNull(AccountType),
});
