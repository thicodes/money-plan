import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { connectionArgs, fromGlobalId } from 'graphql-relay';

import UserType, { UserConnection } from '../modules/user/UserType';
import TransactionType, {
  TransactionConnection,
  TransactionByKindConnection,
} from '../modules/transaction/TransactionType';

import { nodeField } from '../interface/NodeInterface';
import { UserLoader, TransactionLoader } from '../loader';

export default new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    node: nodeField,
    me: {
      type: UserType,
      resolve: (root, args, context) => (context.user ? UserLoader.load(context, context.user._id) : null),
    },
    user: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (obj, args, context) => {
        const { id } = fromGlobalId(args.id);
        return UserLoader.load(context, id);
      },
    },
    users: {
      type: UserConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: (obj, args, context) => UserLoader.loadUsers(context, args),
    },
    transactions: {
      type: TransactionConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: (obj, args, context) => TransactionLoader.loadTransactions(context, args),
    },
    transactionsByKind: {
      type: TransactionByKindConnection.connectionType,
      resolve: (obj, args, context) => {
        return {
          edges: ['Account', 'CreditCard'].map((v, i) => ({ node: { id: i + 1, kindModel: v } })),
        };
      },
    },
    // transactionsTotal: {
    //   type: TransactionsTotal
    // }
  }),
});
