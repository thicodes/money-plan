import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import AccountModel from '../AccountModel';
import { AccountConnection } from '../AccountType';
import * as AccountLoader from '../AccountLoader';

export default mutationWithClientMutationId({
  name: 'AccountCreateMutation',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    bank: {
      type: new GraphQLNonNull(GraphQLString),
    },
    kind: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ name, bank, kind }) => {
    const account = new AccountModel({
      name,
      bank,
      kind,
    });

    await account.save();

    return {
      id: account._id,
      error: null,
    };
  },
  outputFields: {
    accountEdge: {
      type: AccountConnection.edgeType,
      resolve: async ({ id }, _, context) => {
        const account = await AccountLoader.load(context, id);

        if (!account) {
          return null;
        }

        return {
          cursor: toGlobalId('Account', account._id),
          node: account,
        };
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
