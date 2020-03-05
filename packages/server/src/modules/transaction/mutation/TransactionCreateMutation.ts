import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import { generateToken } from '../../../auth';
import pubSub, { EVENTS } from '../../../pubSub';

import TransactionModel from '../TransactionModel';
import { TransactionConnection } from '../TransactionType';
import * as TransactionLoader from '../TransactionLoader';

export default mutationWithClientMutationId({
  name: 'TransactionCreateMutation',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    kind: {
      type: new GraphQLNonNull(GraphQLString),
    },
    kindModel: {
      type: new GraphQLNonNull(GraphQLString),
    },
    tags: {
      type: GraphQLString,
    },
  },
  mutateAndGetPayload: async ({ name, kind, kindModel, tags }) => {
    const transaction = new TransactionModel({
      name,
      kind,
      kindModel,
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
