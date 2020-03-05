import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../core/connection/CustomConnectionType';
import { registerType, nodeInterface } from '../../interface/NodeInterface';

const CreditCardType = new GraphQLObjectType({
  name: 'CreditCard',
  description: 'Credit Card data',
  fields: () => ({
    id: globalIdField('CreditCard'),
    _id: {
      type: GraphQLString,
      resolve: creditCard => creditCard._id,
    },
    name: {
      type: GraphQLString,
      resolve: creditCard => creditCard.name,
    },
  }),
  interfaces: () => [nodeInterface],
});

export default CreditCardType;

registerType(CreditCardType);

export const CreditCardConnection = connectionDefinitions({
  name: 'CreditCard',
  nodeType: GraphQLNonNull(CreditCardType),
});
