import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList,
  GraphQLFloat,
  GraphQLUnionType,
  GraphQLEnumType,
} from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../core/connection/CustomConnectionType';
import { registerType, nodeInterface } from '../../interface/NodeInterface';

import TagType from '../tag/TagType';
import AccountType, { AccountConnection } from '../account/AccountType';
import CreditCardType, { CreditCardConnection } from '../credit-card/CreditCardType';

import { CreditCardLoader, AccountLoader } from '../../loader';
import { timestamps } from '../../graphql/timestampResolver';
import { mongooseIDResolver } from '../../graphql/mongooseIDResolver';

const TransactionKindUnion = new GraphQLUnionType({
  name: 'TransactionKindUnion',
  types: [AccountType, CreditCardType],
  resolveType: object => {
    if (object.__typename === 'Account') return AccountType;
    if (object.__typename === 'CreditCard') return CreditCardType;
    return null;
  },
});

export const ExpenseOrIncomeEnum = new GraphQLEnumType({
  name: 'ExpenseOrIncomeEnum',
  values: {
    EXPENSE: {
      value: 'EXPENSE',
    },
    INCOME: {
      value: 'INCOME',
    },
  },
});

const TransactionType = registerType(
  new GraphQLObjectType({
    name: 'Transaction',
    description: 'Transaction data',
    fields: () => ({
      id: globalIdField('Transaction'),
      ...mongooseIDResolver,
      name: {
        type: GraphQLString,
        resolve: transaction => transaction.name,
      },
      amount: {
        type: GraphQLFloat,
        resolve: transaction => transaction.amount,
      },
      date: {
        type: GraphQLString,
        resolve: transaction => (transaction.date ? transaction.date.toISOString() : null),
      },
      expenseOrIncome: {
        type: ExpenseOrIncomeEnum,
        resolve: transaction => transaction.expenseOrIncome,
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
            return creditCard;
          } else {
            return null;
          }
        },
      },
      isPaid: {
        type: GraphQLBoolean,
        resolve: transaction => transaction.isPaid,
      },
      tags: {
        type: new GraphQLList(TagType),
        resolve: transaction => transaction.tags,
      },
      ...timestamps,
    }),
    interfaces: () => [nodeInterface],
  }),
);

export default TransactionType;

export const TransactionConnection = connectionDefinitions({
  name: 'Transaction',
  nodeType: GraphQLNonNull(TransactionType),
});

const TransactionKindInterface = new GraphQLUnionType({
  name: 'TransactionKindInterface',
  types: [AccountConnection.connectionType, CreditCardConnection.connectionType],
  resolveType: object => {
    if (object.__typename === 'Account') return AccountConnection.connectionType;
    if (object.__typename === 'CreditCard') return CreditCardConnection.connectionType;
    return null;
  },
});

export const TransactionByKindType = registerType(
  new GraphQLObjectType({
    name: 'TransactionByKind',
    description: 'Transaction by kind data',
    fields: () => ({
      id: globalIdField('TransactionByKind'),
      _id: {
        type: GraphQLString,
        resolve: transaction => transaction._id,
      },
      kindModel: {
        type: GraphQLString,
        resolve: transaction => transaction.kindModel,
      },
      kind: {
        type: TransactionKindInterface,
        resolve: async ({ kindModel }, args, context) => {
          if (kindModel === 'Account') {
            const account = await AccountLoader.loadAccounts(context, args);
            account.__typename = kindModel;
            return account;
          } else if (kindModel === 'CreditCard') {
            const creditCard = await CreditCardLoader.loadCreditCards(context, args);
            creditCard.__typename = kindModel;
            return creditCard;
          } else {
            return null;
          }
        },
      },
    }),
    interfaces: () => [nodeInterface],
  }),
);

export const TransactionByKindConnection = connectionDefinitions({
  name: 'TransactionByKind',
  nodeType: GraphQLNonNull(TransactionByKindType),
});

const TransactionTotal = registerType(
  new GraphQLObjectType({
    name: 'TransactionTotal',
    description: 'Transaction total data',
    fields: () => ({
      id: globalIdField('Transaction'),
      ...mongooseIDResolver,
      name: {
        type: GraphQLString,
        resolve: transaction => transaction.name,
      },
      amount: {
        type: GraphQLFloat,
        resolve: transaction => transaction.amount,
      },
      date: {
        type: GraphQLString,
        resolve: transaction => (transaction.date ? transaction.date.toISOString() : null),
      },
      expenseOrIncome: {
        type: ExpenseOrIncomeEnum,
        resolve: transaction => transaction.expenseOrIncome,
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
            return creditCard;
          } else {
            return null;
          }
        },
      },
      isPaid: {
        type: GraphQLBoolean,
        resolve: transaction => transaction.isPaid,
      },
      tags: {
        type: new GraphQLList(TagType),
        resolve: transaction => transaction.tags,
      },
      ...timestamps,
    }),
    interfaces: () => [nodeInterface],
  }),
);
