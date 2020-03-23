import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../core/connection/CustomConnectionType';
import { registerType, nodeInterface } from '../../interface/NodeInterface';
import { timestamps } from '../../graphql/timestampResolver';
import { mongooseIDResolver } from '../../graphql/mongooseIDResolver';

const AccountType = new GraphQLObjectType({
  name: 'Account',
  description: 'Account data',
  fields: () => ({
    id: globalIdField('Account'),
    ...mongooseIDResolver,
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
    ...timestamps,
  }),
  interfaces: () => [nodeInterface],
});

export default AccountType;

registerType(AccountType);

export const AccountConnection = connectionDefinitions({
  name: 'Account',
  nodeType: GraphQLNonNull(AccountType),
});
