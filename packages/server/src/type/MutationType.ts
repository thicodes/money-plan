import { GraphQLObjectType } from 'graphql';

import AccountMutation from '../modules/account/mutation';
import UserMutations from '../modules/user/mutation';
import TransactionMutations from '../modules/transaction/mutation';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...AccountMutation,
    ...UserMutations,
    ...TransactionMutations,
  }),
});
