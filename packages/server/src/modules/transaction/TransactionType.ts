import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList,
  GraphQLUnionType,
} from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../core/connection/CustomConnectionType';
import { registerType, nodeInterface } from '../../interface/NodeInterface';

import TagType from '../tag/TagType';
import AccountType from '../account/AccountType';
import CreditCardType from '../credit-card/CreditCardType';

import { CreditCardLoader, AccountLoader } from '../../loader';

// export const NoteEnityUnion = createUnionType({
//   name: 'NoteEnityUnion',
//   types: () => [Property, /* BusinessProperty, */ Supplier, User],
//   resolveType: value => {
//     if ('contactType' in value) return Contact;
//     if ('buildingType' in value) return Property;
//     if ('supplierType' in value) return Supplier;
//     if ('firstName' in value) return User;
//     // if ("property" in value && "addressString" in value) return BusinessProperty;
//     return undefined;
//   },
// });

const TransactionKindUnion = new GraphQLUnionType({
  name: 'TransactionKindUnion',
  types: [AccountType, CreditCardType],
  resolveType: object => {
    if (object.__typename === 'Account') return AccountType;
    if (object.__typename === 'CreditCard') return CreditCardType;
    return null;
  },
});

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
        type: TransactionKindUnion,
        resolve: async ({ kind, kindModel }, _, context) => {
          if (kindModel === 'Account') {
            const account = await AccountLoader.load(context, kind);
            account.__typename = kindModel;
            return account;
          } else if (kindModel === 'CreditCard') {
            const creditCard = await CreditCardLoader.load(context, kind);
            creditCard.__typename = kindModel;
          } else {
            return null;
          }
        },
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
