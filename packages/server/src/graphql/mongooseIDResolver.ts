import { GraphQLString } from 'graphql';

export const mongooseIDResolver = {
  _id: {
    type: GraphQLString,
    resolve: obj => obj._id,
  },
};
