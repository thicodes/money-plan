import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../core/connection/CustomConnectionType';
import { registerType, nodeInterface } from '../../interface/NodeInterface';
import { timestamps } from '../../graphql/timestampResolver';
import { mongooseIDResolver } from '../../graphql/mongooseIDResolver';

const CreditCardType = new GraphQLObjectType({
  name: 'CreditCard',
  description: 'Credit Card data',
  fields: () => ({
    id: globalIdField('CreditCard'),
    ...mongooseIDResolver,
    name: {
      type: GraphQLString,
      resolve: creditCard => creditCard.name,
    },
    ...timestamps,
  }),
  interfaces: () => [nodeInterface],
});

export default CreditCardType;

registerType(CreditCardType);

export const CreditCardConnection = connectionDefinitions({
  name: 'CreditCard',
  nodeType: GraphQLNonNull(CreditCardType),
});
