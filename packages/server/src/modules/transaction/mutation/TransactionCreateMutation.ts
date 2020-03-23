import { GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import { generateToken } from '../../../auth';
import pubSub, { EVENTS } from '../../../pubSub';

import TransactionModel from '../TransactionModel';
import { TransactionConnection, ExpenseOrIncomeEnum } from '../TransactionType';
import * as TransactionLoader from '../TransactionLoader';

export default mutationWithClientMutationId({
  name: 'TransactionCreate',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    date: {
      type: new GraphQLNonNull(GraphQLString),
    },
    expenseOrIncome: {
      type: ExpenseOrIncomeEnum,
    },
    kind: {
      type: new GraphQLNonNull(GraphQLString),
    },
    kindModel: {
      type: new GraphQLNonNull(GraphQLString),
    },
    isPaid: {
      type: GraphQLBoolean,
    },
    tags: {
      type: GraphQLString,
    },
  },
  mutateAndGetPayload: async ({ name, date, expenseOrIncome, kind, kindModel, isPaid, tags }) => {
    const transaction = new TransactionModel({
      name,
      date,
      expenseOrIncome,
      kind,
      kindModel,
      isPaid,
      tags,
    });

    await transaction.save();

    // await pubSub.publish(EVENTS.TRANSACTION.ADDED, { TransactionAdded: { transaction } });

    return {
      id: transaction._id,
      error: null,
    };
  },
  outputFields: {
    transactionEdge: {
      type: TransactionConnection.edgeType,
      resolve: async ({ id }, _, context) => {
        const transaction = await TransactionLoader.load(context, id);

        if (!transaction) {
          return null;
        }

        return {
          cursor: toGlobalId('Transaction', transaction._id),
          node: transaction,
        };
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
