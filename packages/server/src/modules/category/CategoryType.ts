import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../core/connection/CustomConnectionType';
import { registerType, nodeInterface } from '../../interface/NodeInterface';
import { timestamps } from '../../graphql/timestampResolver';
import { mongooseIDResolver } from '../../graphql/mongooseIDResolver';

const CategoryType = registerType(
  new GraphQLObjectType({
    name: 'Category',
    description: 'Category data',
    fields: () => ({
      id: globalIdField('Category'),
      ...mongooseIDResolver,
      name: {
        type: GraphQLString,
        resolve: category => category.name,
      },
      ...timestamps,
    }),
    interfaces: () => [nodeInterface],
  }),
);

export default CategoryType;

export const CategoryConnection = connectionDefinitions({
  name: 'Category',
  nodeType: GraphQLNonNull(CategoryType),
});
